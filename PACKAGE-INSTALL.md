# DocumentDB Package Installation

Fast and simple installation of DocumentDB extension for PostgreSQL.

**Supported PostgreSQL Versions:** 15, 16, 17

## Install Commands

### Ubuntu & Debian (AMD64 & ARM64)
```bash
curl -fsSL https://documentdb.io/documentdb-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/documentdb-archive-keyring.gpg
echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/documentdb-archive-keyring.gpg] https://documentdb.io/deb stable main" | sudo tee /etc/apt/sources.list.d/documentdb.list
sudo apt update

# Install latest version for PostgreSQL 16 (recommended)
sudo apt install postgresql-16-documentdb
```

### RHEL & CentOS (x86_64 & aarch64)
```bash
# Enable CRB repository (required for PostGIS dependencies)
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --set-enabled crb

# Import GPG key
sudo rpm --import https://documentdb.io/documentdb-archive-keyring.gpg

# Add repository (RHEL/Rocky 9)
cat <<EOF | sudo tee /etc/yum.repos.d/documentdb.repo
[documentdb]
name=DocumentDB PostgreSQL Extension Repository
baseurl=https://documentdb.io/rpm/rhel9
enabled=1
gpgcheck=1
gpgkey=https://documentdb.io/documentdb-archive-keyring.gpg
EOF

# Install latest version for PostgreSQL 16 (recommended)
sudo dnf install postgresql16-documentdb

```

**Note:** CRB (CodeReady Builder) repository is required for PostGIS/GDAL dependencies. PostgreSQL 15 RPM packages may be available in future releases.

## Version Pinning

You can install either the latest version or pin to a specific DocumentDB version:

### APT (Debian/Ubuntu)
```bash
# Install latest version (recommended - gets updates automatically)
sudo apt install postgresql-16-documentdb

# Pin to specific version (won't auto-update)
sudo apt install postgresql-16-documentdb=0.107-0

# List all available versions
apt-cache madison postgresql-16-documentdb
```

### YUM/DNF (RHEL/CentOS)
```bash
# Install latest version (recommended - gets updates automatically)
sudo dnf install postgresql16-documentdb

# Pin to specific version (won't auto-update)
sudo dnf install postgresql16-documentdb-0.107.0-1.el9

# List all available versions
dnf --showduplicates list postgresql16-documentdb
```

## Version & Architecture Support

### Architecture Support

**APT Packages (DEB):**
- ✅ AMD64/x86_64 (Intel/AMD 64-bit processors)
- ✅ ARM64/aarch64 (Apple M1/M2, AWS Graviton, Raspberry Pi, etc.)

**YUM Packages (RPM):**
- ✅ x86_64 (Intel/AMD 64-bit processors)
- ✅ aarch64 (ARM64 processors - AWS Graviton, etc.)

### OS Distribution Support

**Debian/Ubuntu (APT):**
- Ubuntu 22.04 (Jammy)
- Ubuntu 24.04 (Noble)
- Debian 11 (Bullseye)
- Debian 12 (Bookworm)

**RHEL-based distributions (YUM/DNF):**
- RHEL 8/9
- Rocky Linux 8/9
- AlmaLinux 8/9
- CentOS Stream 8/9

## Quick Install (Skip GPG Verification)

**⚠️ Warning:** Skipping GPG verification is not recommended for production environments.

### Ubuntu & Debian
```bash
echo "deb [arch=amd64,arm64 trusted=yes] https://documentdb.io/deb stable main" | sudo tee /etc/apt/sources.list.d/documentdb.list
sudo apt update
sudo apt install postgresql-16-documentdb
```

### RHEL & CentOS  
```bash
cat <<EOF | sudo tee /etc/yum.repos.d/documentdb.repo
[documentdb]
name=DocumentDB PostgreSQL Extension Repository
baseurl=https://documentdb.io/rpm/rhel9
enabled=1
gpgcheck=0
EOF
sudo dnf install postgresql16-documentdb
```

## Distribution-Specific Installation

### Ubuntu 22.04 (Jammy)
```bash
curl -fsSL https://documentdb.io/documentdb-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/documentdb-archive-keyring.gpg
echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/documentdb-archive-keyring.gpg] https://documentdb.io/deb stable ubuntu22" | sudo tee /etc/apt/sources.list.d/documentdb.list
sudo apt update && sudo apt install postgresql-16-documentdb
```

### Ubuntu 24.04 (Noble)
```bash
curl -fsSL https://documentdb.io/documentdb-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/documentdb-archive-keyring.gpg
echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/documentdb-archive-keyring.gpg] https://documentdb.io/deb stable ubuntu24" | sudo tee /etc/apt/sources.list.d/documentdb.list
sudo apt update && sudo apt install postgresql-16-documentdb
```

### Debian 11 (Bullseye)
```bash
curl -fsSL https://documentdb.io/documentdb-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/documentdb-archive-keyring.gpg
echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/documentdb-archive-keyring.gpg] https://documentdb.io/deb stable deb11" | sudo tee /etc/apt/sources.list.d/documentdb.list
sudo apt update && sudo apt install postgresql-16-documentdb
```

### Debian 12 (Bookworm)
```bash
curl -fsSL https://documentdb.io/documentdb-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/documentdb-archive-keyring.gpg
echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/documentdb-archive-keyring.gpg] https://documentdb.io/deb stable deb12" | sudo tee /etc/apt/sources.list.d/documentdb.list
sudo apt update && sudo apt install postgresql-16-documentdb
```

### RHEL/Rocky/AlmaLinux/CentOS Stream 8
```bash
# Enable CRB repository (required for PostGIS dependencies)
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --set-enabled crb

sudo rpm --import https://documentdb.io/documentdb-archive-keyring.gpg
cat <<EOF | sudo tee /etc/yum.repos.d/documentdb.repo
[documentdb]
name=DocumentDB PostgreSQL Extension Repository
baseurl=https://documentdb.io/rpm/rhel8
enabled=1
gpgcheck=1
gpgkey=https://documentdb.io/documentdb-archive-keyring.gpg
EOF
sudo dnf install postgresql16-documentdb
```

### RHEL/Rocky/AlmaLinux/CentOS Stream 9
```bash
# Enable CRB repository (required for PostGIS dependencies)
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --set-enabled crb

sudo rpm --import https://documentdb.io/documentdb-archive-keyring.gpg
cat <<EOF | sudo tee /etc/yum.repos.d/documentdb.repo
[documentdb]
name=DocumentDB PostgreSQL Extension Repository
baseurl=https://documentdb.io/rpm/rhel9
enabled=1
gpgcheck=1
gpgkey=https://documentdb.io/documentdb-archive-keyring.gpg
EOF
sudo dnf install postgresql16-documentdb
```

## Fix Common Issues

### Repository not found
```bash
sudo apt update          # Ubuntu/Debian
sudo yum clean all       # RHEL/CentOS
```

### Package not found
```bash
apt search documentdb    # Ubuntu/Debian
yum search documentdb    # RHEL/CentOS
```

### Check installation
```bash
# Ubuntu/Debian - List installed packages
dpkg -l "*documentdb*"

# Ubuntu/Debian - Show specific package version
apt-cache policy postgresql-16-documentdb

# RHEL/CentOS - List installed packages
rpm -qa "*documentdb*"

# RHEL/CentOS - Show specific package version
rpm -qi postgresql16-documentdb
```

## Repository Structure

### APT Repository Layout (Multi-Architecture)
```
https://documentdb.github.io/
├── deb/
│   ├── dists/stable/
│   │   ├── main/binary-amd64/         # Default AMD64 packages
│   │   ├── main/binary-arm64/         # Default ARM64 packages  
│   │   ├── ubuntu22/binary-amd64/     # Ubuntu 22.04 AMD64
│   │   ├── ubuntu22/binary-arm64/     # Ubuntu 22.04 ARM64
│   │   ├── ubuntu24/binary-amd64/     # Ubuntu 24.04 AMD64
│   │   └── ubuntu24/binary-arm64/     # Ubuntu 24.04 ARM64
│   ├── deb11/dists/stable/main/       # Debian 11 (both archs)
│   └── deb12/dists/stable/main/       # Debian 12 (both archs)
└── documentdb-archive-keyring.gpg     # GPG public key
```

### YUM Repository Layout (Multi-Architecture)
```
https://documentdb.github.io/
├── rpm/
│   ├── rhel8/
│   │   ├── repodata/                  # Repository metadata
│   │   └── packages/                  # RPM files (x86_64 & aarch64)
│   └── rhel9/
│       ├── repodata/                  # Repository metadata
│       └── packages/                  # RPM files (x86_64 & aarch64)
└── documentdb-archive-keyring.gpg     # GPG public key
```

### Package Locations
```
https://documentdb.io/
└── packages/                          # All packages (direct download)
    # DEB packages (version 0.107-0)
    ├── postgresql-15-documentdb_0.107-0_amd64.deb
    ├── postgresql-15-documentdb_0.107-0_arm64.deb
    ├── postgresql-15-documentdb-dbgsym_0.107-0_amd64.deb
    ├── postgresql-15-documentdb-dbgsym_0.107-0_arm64.deb
    ├── postgresql-16-documentdb_0.107-0_amd64.deb
    ├── postgresql-16-documentdb_0.107-0_arm64.deb
    ├── postgresql-16-documentdb-dbgsym_0.107-0_amd64.deb
    ├── postgresql-16-documentdb-dbgsym_0.107-0_arm64.deb
    ├── postgresql-17-documentdb_0.107-0_amd64.deb
    ├── postgresql-17-documentdb_0.107-0_arm64.deb
    ├── postgresql-17-documentdb-dbgsym_0.107-0_amd64.deb
    ├── postgresql-17-documentdb-dbgsym_0.107-0_arm64.deb
    # RPM packages (version 0.107.0-1) - x86_64 only
    ├── postgresql16-documentdb-0.107.0-1.el8.x86_64.rpm
    ├── postgresql16-documentdb-0.107.0-1.el9.x86_64.rpm
    ├── postgresql17-documentdb-0.107.0-1.el8.x86_64.rpm
    └── postgresql17-documentdb-0.107.0-1.el9.x86_64.rpm
```

## Direct Downloads

**Repository packages:** https://documentdb.io/packages/

**GitHub releases:** https://github.com/documentdb/documentdb/releases

## Package Naming Convention

### DEB Packages
- Format: `postgresql-{PG_VERSION}-documentdb_{DOCUMENTDB_VERSION}_arch.deb`
- Example: `postgresql-16-documentdb_0.107-0_amd64.deb`
- Debug symbols: `postgresql-{PG_VERSION}-documentdb-dbgsym_{DOCUMENTDB_VERSION}_arch.deb`

### RPM Packages
- Format: `postgresql{PG_VERSION}-documentdb-{DOCUMENTDB_VERSION}.el{RHEL_VERSION}.arch.rpm`
- Example: `postgresql16-documentdb-0.107.0-1.el9.x86_64.rpm`

## Release Information

The repository includes a `release-info.json` file with metadata about available packages:
- https://documentdb.io/packages/release-info.json