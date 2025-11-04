#!/bin/bash
set -e

# Repository to download packages from
REPO="documentdb/documentdb"

# Output directory
OUT_DIR="out"

# Version Configuration
# Set to specific version (e.g., "v0.107-0") or "latest" for most recent release
DOCUMENTDB_VERSION="${DOCUMENTDB_VERSION:-latest}"
# Multi-version support: set to "true" to keep multiple versions in repository
MULTI_VERSION="${MULTI_VERSION:-true}"

# Repository configuration
SUITE="${SUITE:-stable}"
COMPONENTS="${COMPONENTS:-main}"
ORIGIN="${ORIGIN:-DocumentDB}"




DESCRIPTION="${DESCRIPTION:-DocumentDB APT and YUM Repository}"

GOT_DEB=0
GOT_RPM=0
DEB_POOL="out/deb/pool/${COMPONENTS}"
# Debian/Ubuntu pools
DEB_POOL_DEB11="out/deb/pool/deb11"
DEB_POOL_DEB12="out/deb/pool/deb12" 
DEB_POOL_UBUNTU22="out/deb/pool/ubuntu22"
DEB_POOL_UBUNTU24="out/deb/pool/ubuntu24"
# RPM pools
RPM_POOL_RHEL8="out/rpm/rhel8"
RPM_POOL_RHEL9="out/rpm/rhel9"

DEB_DISTS="dists/${SUITE}"
DEB_DISTS_COMPONENTS="${DEB_DISTS}/${COMPONENTS}/binary-amd64"
DEB_DISTS_DEB11="${DEB_DISTS}/deb11/binary-amd64"
DEB_DISTS_DEB12="${DEB_DISTS}/deb12/binary-amd64"
DEB_DISTS_UBUNTU22="${DEB_DISTS}/ubuntu22/binary-amd64"
DEB_DISTS_UBUNTU24="${DEB_DISTS}/ubuntu24/binary-amd64"
GPG_TTY=""
export GPG_TTY

generate_hashes() {
  HASH_TYPE="$1"
  HASH_COMMAND="$2"
  echo "${HASH_TYPE}:"
  # Find all component directories and generate hashes for all files
  for component in ${COMPONENTS} deb11 deb12 ubuntu22 ubuntu24; do
    if [ -d "$component" ]; then
      find "$component" -type f | while read -r file
      do
        echo " $(${HASH_COMMAND} "$file" | cut -d" " -f1) $(wc -c "$file" | awk '{print $1}') $file"
      done
    fi
  done
}

echo "Downloading packages from $REPO releases"

# Get release info based on DOCUMENTDB_VERSION setting
if [ "$DOCUMENTDB_VERSION" = "latest" ]; then
  echo "Fetching latest release..."
  if release=$(curl -fqs "https://api.github.com/repos/${REPO}/releases" | python3 -c "import sys, json; releases = json.load(sys.stdin); print(json.dumps(releases[0])) if releases else sys.exit(1)")
  then
    tag="$(echo "$release" | python3 -c "import sys, json; print(json.load(sys.stdin)['tag_name'])")"
    echo "Found latest release: $tag"
  else
    echo "Error: Could not fetch latest release information"
    exit 1
  fi
else
  echo "Using specified version: $DOCUMENTDB_VERSION"
  tag="$DOCUMENTDB_VERSION"
  # Verify the specified version exists
  if ! release=$(curl -fqs "https://api.github.com/repos/${REPO}/releases/tags/$tag")
  then
    echo "Error: Version $tag not found in releases"
    exit 1
  fi
  echo "Found specified release: $tag"
fi

# Show version information now that we have the tag

  
  # Create packages directory for direct downloads
  mkdir -p out/packages
  
  # Process each asset
  # First, create a temporary file to store asset information
  ASSETS_FILE=$(mktemp)
  echo "$release" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for asset in data.get('assets', []):
    print(f\"{asset['name']}|{asset['browser_download_url']}\")
" > "$ASSETS_FILE"

  # Process each asset
  while IFS='|' read -r filename download_url
  do
    if [ -z "$filename" ]; then
      continue
    fi
    
    echo "Processing: $filename"
    
    # Determine file type and handle accordingly
    if [[ "$filename" == *.deb ]]; then
      # Always download all deb packages for direct access
      mkdir -p out/packages
      echo "  Downloading DEB package for direct download"
      wget -q -P out/packages "$download_url"
      
      # For APT repository, organize packages by distribution
      if [[ "$filename" =~ ^deb11-postgresql-[0-9]+-documentdb.*\.deb$ ]]; then
        GOT_DEB=1
        mkdir -p "$DEB_POOL_DEB11"
        clean_name=$(echo "$filename" | sed 's/^deb11-//')
        echo "  Adding Debian 11 package to APT repository: $filename -> $clean_name"
        if [ "$MULTI_VERSION" = "true" ]; then
          # Multi-version mode: overwrite same version, preserve different versions
          cp "out/packages/$filename" "$DEB_POOL_DEB11/$clean_name"
          if [ -f "$DEB_POOL_DEB11/$clean_name" ]; then
            echo "    Updated existing package: $clean_name"
          else
            echo "    Added new package: $clean_name"
          fi
        else
          # Single version mode: overwrite everything
          cp "out/packages/$filename" "$DEB_POOL_DEB11/$clean_name"
        fi
      elif [[ "$filename" =~ ^deb12-postgresql-[0-9]+-documentdb.*\.deb$ ]]; then
        GOT_DEB=1
        mkdir -p "$DEB_POOL_DEB12"
        clean_name=$(echo "$filename" | sed 's/^deb12-//')
        echo "  Adding Debian 12 package to APT repository: $filename -> $clean_name"
        if [ "$MULTI_VERSION" = "true" ]; then
          cp "out/packages/$filename" "$DEB_POOL_DEB12/$clean_name"
          echo "    Updated package: $clean_name"
        else
          cp "out/packages/$filename" "$DEB_POOL_DEB12/$clean_name"
        fi
      elif [[ "$filename" =~ ^ubuntu22\.04-postgresql-[0-9]+-documentdb.*\.deb$ ]]; then
        GOT_DEB=1
        mkdir -p "$DEB_POOL_UBUNTU22"
        clean_name=$(echo "$filename" | sed 's/^ubuntu22\.04-//')
        echo "  Adding Ubuntu 22.04 package to APT repository: $filename -> $clean_name"
        if [ "$MULTI_VERSION" = "true" ]; then
          cp "out/packages/$filename" "$DEB_POOL_UBUNTU22/$clean_name"
          echo "    Updated package: $clean_name"
        else
          cp "out/packages/$filename" "$DEB_POOL_UBUNTU22/$clean_name"
        fi
      elif [[ "$filename" =~ ^ubuntu24\.04-postgresql-[0-9]+-documentdb.*\.deb$ ]]; then
        GOT_DEB=1
        mkdir -p "$DEB_POOL_UBUNTU24"
        clean_name=$(echo "$filename" | sed 's/^ubuntu24\.04-//')
        echo "  Adding Ubuntu 24.04 package to APT repository: $filename -> $clean_name"
        if [ "$MULTI_VERSION" = "true" ]; then
          cp "out/packages/$filename" "$DEB_POOL_UBUNTU24/$clean_name"
          echo "    Updated package: $clean_name"
        else
          cp "out/packages/$filename" "$DEB_POOL_UBUNTU24/$clean_name"
        fi
      else
        echo "  Skipping $filename for APT repository (unsupported distribution or architecture)"
      fi
    elif [[ "$filename" == *.rpm ]]; then
      # Always download all RPM packages for direct access
      mkdir -p out/packages
      echo "  Downloading RPM package for direct download"
      wget -q -P out/packages "$download_url"
      
      # For YUM repository, organize packages by distribution
      if [[ "$filename" =~ ^rhel8-postgresql[0-9]+-documentdb.*\.rpm$ ]]; then
        GOT_RPM=1
        mkdir -p "$RPM_POOL_RHEL8"
        clean_name=$(echo "$filename" | sed 's/^rhel8-//')
        echo "  Adding RHEL 8 package to YUM repository: $filename -> $clean_name"
        if [ "$MULTI_VERSION" = "true" ]; then
          cp "out/packages/$filename" "$RPM_POOL_RHEL8/$clean_name"
          echo "    Updated package: $clean_name"
        else
          cp "out/packages/$filename" "$RPM_POOL_RHEL8/$clean_name"
        fi
      elif [[ "$filename" =~ ^rhel9-postgresql[0-9]+-documentdb.*\.rpm$ ]]; then
        GOT_RPM=1
        mkdir -p "$RPM_POOL_RHEL9"
        clean_name=$(echo "$filename" | sed 's/^rhel9-//')
        echo "  Adding RHEL 9 package to YUM repository: $filename -> $clean_name"
        if [ "$MULTI_VERSION" = "true" ]; then
          cp "out/packages/$filename" "$RPM_POOL_RHEL9/$clean_name"
          echo "    Updated package: $clean_name"
        else
          cp "out/packages/$filename" "$RPM_POOL_RHEL9/$clean_name"
        fi
      else
        echo "  Skipping $filename for YUM repository (unsupported distribution or architecture)"
      fi
    else
      # Other files go directly to packages
      echo "  Downloading to packages directory"
      wget -q -P out/packages "$download_url"
    fi
  done < "$ASSETS_FILE"
  
  # Clean up temporary file
  rm -f "$ASSETS_FILE"
  
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
  echo "GOT_DEB=$GOT_DEB, GOT_RPM=$GOT_RPM"
  echo "Checking DEB_POOL directory: $DEB_POOL"
  ls -la "$DEB_POOL" 2>/dev/null || echo "DEB_POOL directory does not exist"

# Build DEB repository if we have DEB packages
echo "Checking if DEB repository should be built..."
echo "DEB_POOL exists: $([ -d "$DEB_POOL" ] && echo 'yes' || echo 'no')"
if [ -d "$DEB_POOL" ]; then
  echo "DEB_POOL contents:"
  ls -la "$DEB_POOL"
fi
echo "DEB files in pool: $(ls -1 $DEB_POOL/*.deb 2>/dev/null | wc -l)"

if [ "$GOT_DEB" = "1" ]; then
  echo "Building APT repository with multiple distribution components..."
  pushd out/deb >/dev/null
  
  # Create main component with Ubuntu 22.04 packages (for backward compatibility)
  if [ -d "pool/ubuntu22" ] && [ "$(ls -A pool/ubuntu22/*.deb 2>/dev/null)" ]; then
    mkdir -p "${DEB_DISTS_COMPONENTS}"
    echo "Scanning Ubuntu 22.04 packages for main component"
    dpkg-scanpackages --arch amd64 pool/ubuntu22/ > "${DEB_DISTS_COMPONENTS}/Packages"
    gzip -k -f "${DEB_DISTS_COMPONENTS}/Packages"
  fi
  
  # Create deb11 component (Debian 11 Bullseye)
  if [ -d "pool/deb11" ] && [ "$(ls -A pool/deb11/*.deb 2>/dev/null)" ]; then
    mkdir -p "${DEB_DISTS_DEB11}"
    echo "Scanning Debian 11 packages for deb11 component"
    dpkg-scanpackages --arch amd64 pool/deb11/ > "${DEB_DISTS_DEB11}/Packages"
    gzip -k -f "${DEB_DISTS_DEB11}/Packages"
  fi
  
  # Create deb12 component (Debian 12 Bookworm)
  if [ -d "pool/deb12" ] && [ "$(ls -A pool/deb12/*.deb 2>/dev/null)" ]; then
    mkdir -p "${DEB_DISTS_DEB12}"
    echo "Scanning Debian 12 packages for deb12 component"
    dpkg-scanpackages --arch amd64 pool/deb12/ > "${DEB_DISTS_DEB12}/Packages"
    gzip -k -f "${DEB_DISTS_DEB12}/Packages"
  fi
  
  # Create ubuntu22 component (Ubuntu 22.04 Jammy)
  if [ -d "pool/ubuntu22" ] && [ "$(ls -A pool/ubuntu22/*.deb 2>/dev/null)" ]; then
    mkdir -p "${DEB_DISTS_UBUNTU22}"
    echo "Scanning Ubuntu 22.04 packages for ubuntu22 component"
    dpkg-scanpackages --arch amd64 pool/ubuntu22/ > "${DEB_DISTS_UBUNTU22}/Packages"
    gzip -k -f "${DEB_DISTS_UBUNTU22}/Packages"
  fi
  
  # Create ubuntu24 component (Ubuntu 24.04 Noble)
  if [ -d "pool/ubuntu24" ] && [ "$(ls -A pool/ubuntu24/*.deb 2>/dev/null)" ]; then
    mkdir -p "${DEB_DISTS_UBUNTU24}"
    echo "Scanning Ubuntu 24.04 packages for ubuntu24 component"
    dpkg-scanpackages --arch amd64 pool/ubuntu24/ > "${DEB_DISTS_UBUNTU24}/Packages"
    gzip -k -f "${DEB_DISTS_UBUNTU24}/Packages"
  fi
  
  pushd "${DEB_DISTS}" >/dev/null
  
  echo "Creating Release file"
  # Determine which components we actually have
  AVAILABLE_COMPONENTS=""
  [ -d "${COMPONENTS}/binary-amd64" ] && AVAILABLE_COMPONENTS="${AVAILABLE_COMPONENTS} ${COMPONENTS}"
  [ -d "deb11/binary-amd64" ] && AVAILABLE_COMPONENTS="${AVAILABLE_COMPONENTS} deb11"
  [ -d "deb12/binary-amd64" ] && AVAILABLE_COMPONENTS="${AVAILABLE_COMPONENTS} deb12"
  [ -d "ubuntu22/binary-amd64" ] && AVAILABLE_COMPONENTS="${AVAILABLE_COMPONENTS} ubuntu22"
  [ -d "ubuntu24/binary-amd64" ] && AVAILABLE_COMPONENTS="${AVAILABLE_COMPONENTS} ubuntu24"
  AVAILABLE_COMPONENTS=$(echo $AVAILABLE_COMPONENTS | sed 's/^ *//')
  
  {
    echo "Origin: ${ORIGIN}"
    echo "Label: DocumentDB"
    echo "Suite: ${SUITE}"
    echo "Codename: ${SUITE}"
    echo "Version: 1.0"
    echo "Architectures: amd64"
    echo "Components: ${AVAILABLE_COMPONENTS}"
    echo "Description: ${DESCRIPTION} - Multiple distributions supported"
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


  echo "APT repository built successfully with multiple distribution support"
fi

# Build RPM repositories if we have RPM packages
if [ "$GOT_RPM" = "1" ]; then
  echo "Building YUM repositories for different RHEL versions..."
  
  # Build RHEL 8 repository
  if [ -d "$RPM_POOL_RHEL8" ] && [ "$(ls -A $RPM_POOL_RHEL8/*.rpm 2>/dev/null)" ]; then
    echo "Building RHEL 8 YUM repository..."
    pushd "$RPM_POOL_RHEL8" >/dev/null
    
    # Sign RPMs if GPG is available
    if [ -n "$GPG_FINGERPRINT" ]; then
      echo "Signing RHEL 8 RPM packages"
      for rpm_file in *.rpm; do
        rpm --define "%_signature gpg" --define "%_gpg_name ${GPG_FINGERPRINT}" --addsign "$rpm_file" || echo "Warning: Could not sign $rpm_file"
      done
    fi
    
    echo "Creating RHEL 8 YUM repository metadata"
    if command -v createrepo_c >/dev/null 2>&1; then
      createrepo_c .
    else
      echo "Warning: createrepo_c not found, skipping YUM repository metadata creation"
    fi
    
    # Sign repository metadata if GPG is available
    if [ -n "$GPG_FINGERPRINT" ]; then
      echo "Signing RHEL 8 repository metadata"
      gpg --default-key "$GPG_FINGERPRINT" --detach-sign --armor repodata/repomd.xml
    fi
    
    popd >/dev/null
  fi
  
  # Build RHEL 9 repository
  if [ -d "$RPM_POOL_RHEL9" ] && [ "$(ls -A $RPM_POOL_RHEL9/*.rpm 2>/dev/null)" ]; then
    echo "Building RHEL 9 YUM repository..."
    pushd "$RPM_POOL_RHEL9" >/dev/null
    
    # Sign RPMs if GPG is available
    if [ -n "$GPG_FINGERPRINT" ]; then
      echo "Signing RHEL 9 RPM packages"
      for rpm_file in *.rpm; do
        rpm --define "%_signature gpg" --define "%_gpg_name ${GPG_FINGERPRINT}" --addsign "$rpm_file" || echo "Warning: Could not sign $rpm_file"
      done
    fi
    
    echo "Creating RHEL 9 YUM repository metadata"
    if command -v createrepo_c >/dev/null 2>&1; then
      createrepo_c .
    else
      echo "Warning: createrepo_c not found, skipping YUM repository metadata creation"
    fi
    
    # Sign repository metadata if GPG is available
    if [ -n "$GPG_FINGERPRINT" ]; then
      echo "Signing RHEL 9 repository metadata"
      gpg --default-key "$GPG_FINGERPRINT" --detach-sign --armor repodata/repomd.xml
    fi
    
    popd >/dev/null
  fi
  
  # Also create a main RPM repository with RHEL 8 packages for backward compatibility
  if [ -d "$RPM_POOL_RHEL8" ] && [ "$(ls -A $RPM_POOL_RHEL8/*.rpm 2>/dev/null)" ]; then
    mkdir -p out/rpm/main
    cp "$RPM_POOL_RHEL8"/* out/rpm/main/
    pushd out/rpm/main >/dev/null
    echo "Creating main YUM repository (RHEL 8 packages)"
    if command -v createrepo_c >/dev/null 2>&1; then
      createrepo_c .
    else
      echo "Warning: createrepo_c not found, skipping YUM repository metadata creation"
    fi
    if [ -n "$GPG_FINGERPRINT" ]; then
      gpg --default-key "$GPG_FINGERPRINT" --detach-sign --armor repodata/repomd.xml
    fi
    popd >/dev/null
  fi
  
  echo "YUM repositories built successfully"
fi


echo "Package repository setup complete!"
echo ""
echo "Repository structure:"
ls -lh out/


echo "Package download complete!"
ls -lh out/packages/
