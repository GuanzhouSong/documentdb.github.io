#!/bin/bash
set -e

# Repository to download packages from
REPO="documentdb/documentdb"

# Repository configuration
SUITE="${SUITE:-stable}"
COMPONENTS="${COMPONENTS:-main}"
ORIGIN="${ORIGIN:-DocumentDB}"
DESCRIPTION="${DESCRIPTION:-DocumentDB APT and YUM Repository}"

GOT_DEB=0
GOT_RPM=0
DEB_POOL="out/deb/pool/${COMPONENTS}"
DEB_DISTS="dists/${SUITE}"
DEB_DISTS_COMPONENTS="${DEB_DISTS}/${COMPONENTS}/binary-amd64"
GPG_TTY=""
export GPG_TTY

generate_hashes() {
  HASH_TYPE="$1"
  HASH_COMMAND="$2"
  echo "${HASH_TYPE}:"
  find "${COMPONENTS}" -type f | while read -r file
  do
    echo " $(${HASH_COMMAND} "$file" | cut -d" " -f1) $(wc -c "$file" | awk '{print $1}')"
  done
}

echo "Downloading packages from $REPO releases"

# Get the latest release info (including pre-releases)
if release=$(curl -fqs "https://api.github.com/repos/${REPO}/releases" | python3 -c "import sys, json; releases = json.load(sys.stdin); print(json.dumps(releases[0])) if releases else sys.exit(1)")
then
  tag="$(echo "$release" | python3 -c "import sys, json; print(json.load(sys.stdin)['tag_name'])")"
  echo "Found latest release: $tag"
  
  # Create packages directory for direct downloads
  mkdir -p out/packages
  
  # Process each asset
  echo "$release" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for asset in data.get('assets', []):
    print(f\"{asset['name']}|{asset['browser_download_url']}\")
" | while IFS='|' read -r filename download_url
  do
    if [ -z "$filename" ]; then
      continue
    fi
    
    echo "Processing: $filename"
    
    # Determine file type and handle accordingly
    if [[ "$filename" == *.deb ]]; then
      GOT_DEB=1
      mkdir -p "$DEB_POOL"
      echo "  Downloading DEB package to pool"
      wget -q -P "$DEB_POOL" "$download_url"
      # Also copy to packages for direct download
      cp "$DEB_POOL/$filename" out/packages/
    elif [[ "$filename" == *.rpm ]]; then
      GOT_RPM=1
      mkdir -p out/rpm
      echo "  Downloading RPM package"
      wget -q -P out/rpm "$download_url"
      # Also copy to packages for direct download
      cp "out/rpm/$filename" out/packages/
    else
      # Other files go directly to packages
      echo "  Downloading to packages directory"
      wget -q -P out/packages "$download_url"
    fi
  done
  
  # Save release metadata
  echo "$release" | python3 -c "
import sys, json
data = json.load(sys.stdin)
output = {
    'tag_name': data['tag_name'],
    'name': data.get('name', data['tag_name']),
    'published_at': data['published_at'],
    'html_url': data['html_url'],
    'assets': [{
        'name': asset['name'],
        'browser_download_url': asset['browser_download_url'],
        'size': asset['size'],
        'download_count': asset.get('download_count', 0)
    } for asset in data.get('assets', [])]
}
print(json.dumps(output, indent=2))
" > out/packages/release-info.json
  
  echo "Successfully processed packages from $REPO"
else
  echo "Error: Could not fetch release information for $REPO"
  exit 1
fi

# Build DEB repository if we have DEB packages
if [ -d "$DEB_POOL" ] && [ "$(ls -A $DEB_POOL/*.deb 2>/dev/null)" ]; then
  echo "Building APT repository..."
  pushd out/deb >/dev/null
  
  mkdir -p "${DEB_DISTS_COMPONENTS}"
  
  echo "Scanning DEB packages and creating Packages file"
  dpkg-scanpackages --arch amd64 pool/ > "${DEB_DISTS_COMPONENTS}/Packages"
  gzip -k -f "${DEB_DISTS_COMPONENTS}/Packages"
  
  pushd "${DEB_DISTS}" >/dev/null
  
  echo "Creating Release file"
  {
    echo "Origin: ${ORIGIN}"
    echo "Label: DocumentDB"
    echo "Suite: ${SUITE}"
    echo "Codename: ${SUITE}"
    echo "Version: 1.0"
    echo "Architectures: amd64"
    echo "Components: ${COMPONENTS}"
    echo "Description: ${DESCRIPTION}"
    echo "Date: $(date -Ru)"
    generate_hashes MD5Sum md5sum
    generate_hashes SHA1 sha1sum
    generate_hashes SHA256 sha256sum
  } > Release
  
  # Sign if GPG is available
  if [ -n "$GPG_FINGERPRINT" ]; then
    echo "Signing Release file with GPG"
    gpg --default-key "$GPG_FINGERPRINT" --detach-sign --armor -o Release.gpg Release
    gpg --default-key "$GPG_FINGERPRINT" --clearsign -o InRelease Release
  else
    echo "Warning: GPG_FINGERPRINT not set, skipping package signing"
  fi
  
  popd >/dev/null
  popd >/dev/null
  echo "APT repository built successfully"
fi

# Build RPM repository if we have RPM packages
if [ -d "out/rpm" ] && [ "$(ls -A out/rpm/*.rpm 2>/dev/null)" ]; then
  echo "Building YUM repository..."
  pushd out/rpm >/dev/null
  
  # Sign RPMs if GPG is available
  if [ -n "$GPG_FINGERPRINT" ]; then
    echo "Signing RPM packages"
    for rpm_file in *.rpm; do
      rpm --define "%_signature gpg" --define "%_gpg_name ${GPG_FINGERPRINT}" --addsign "$rpm_file" || echo "Warning: Could not sign $rpm_file"
    done
  fi
  
  echo "Creating YUM repository metadata"
  createrepo_c .
  
  # Sign repository metadata if GPG is available
  if [ -n "$GPG_FINGERPRINT" ]; then
    echo "Signing repository metadata"
    gpg --default-key "$GPG_FINGERPRINT" --detach-sign --armor repodata/repomd.xml
  fi
  
  popd >/dev/null
  echo "YUM repository built successfully"
fi


echo "Package repository setup complete!"
echo ""
echo "Repository structure:"
ls -lh out/

# Create an index file for the packages

echo "Package download complete!"
ls -lh out/packages/
