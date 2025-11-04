# DocumentDB Package Installation

Fast and simple installation of DocumentDB.

## Install Commands

### Ubuntu & Debian (AMD64 & ARM64)
```bash
curl -fsSL https://documentdb.github.io/documentdb-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/documentdb-archive-keyring.gpg
echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/documentdb-archive-keyring.gpg] https://documentdb.github.io/deb stable main" | sudo tee /etc/apt/sources.list.d/documentdb.list
sudo apt update
sudo apt install postgresql-16-documentdb
```

### RHEL & CentOS (x86_64 & aarch64)
```bash
curl -fsSL https://documentdb.github.io/documentdb-archive-keyring.gpg | sudo rpm --import -
cat <<EOF | sudo tee /etc/yum.repos.d/documentdb.repo
[documentdb]
name=DocumentDB
baseurl=https://documentdb.github.io/rpm/rhel8
enabled=1
gpgcheck=1
gpgkey=https://documentdb.github.io/documentdb-archive-keyring.gpg
EOF
sudo yum install postgresql-16-documentdb
```

## Package Names

| PostgreSQL | APT Package | YUM Package |
|------------|-------------|-------------|
| 15 | postgresql-15-documentdb | postgresql15-documentdb |
| 16 | postgresql-16-documentdb | postgresql16-documentdb |
| 17 | postgresql-17-documentdb | postgresql17-documentdb |

## Architecture Support

**APT Packages (DEB):**
- ✅ AMD64/x86_64 (Intel/AMD 64-bit processors)
- ✅ ARM64/aarch64 (Apple M1/M2, AWS Graviton, Raspberry Pi, etc.)

**YUM Packages (RPM):**
- ✅ x86_64 (Intel/AMD 64-bit processors)
- ✅ aarch64 (ARM64 processors - AWS Graviton, etc.)

## Quick Install (Skip GPG)

### Ubuntu & Debian
```bash
echo "deb [arch=amd64,arm64 trusted=yes] https://documentdb.github.io/deb stable main" | sudo tee /etc/apt/sources.list.d/documentdb.list
sudo apt update
sudo apt install postgresql-16-documentdb
```

### RHEL & CentOS  
```bash
cat <<EOF | sudo tee /etc/yum.repos.d/documentdb.repo
[documentdb]
name=DocumentDB
baseurl=https://documentdb.github.io/rpm/rhel8
enabled=1
gpgcheck=0
EOF
sudo yum install postgresql-16-documentdb
```

## Different OS Versions

### Specific Debian/Ubuntu
```bash
# Ubuntu 22.04
https://documentdb.github.io/deb stable ubuntu22

# Ubuntu 24.04
https://documentdb.github.io/deb stable ubuntu24

# Debian 11
https://documentdb.github.io/deb/deb11 stable main

# Debian 12  
https://documentdb.github.io/deb/deb12 stable main
```

### Specific RHEL/CentOS
```bash
# RHEL/CentOS 8
baseurl=https://documentdb.github.io/rpm/rhel8

# RHEL/CentOS 9
baseurl=https://documentdb.github.io/rpm/rhel9
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
dpkg -l "*documentdb*"   # Ubuntu/Debian  
rpm -qa "*documentdb*"   # RHEL/CentOS
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
https://documentdb.github.io/
└── packages/                          # All packages (direct download)
    ├── postgresql-15-documentdb_*_amd64.deb
    ├── postgresql-15-documentdb_*_arm64.deb
    ├── postgresql-16-documentdb_*_amd64.deb
    ├── postgresql-16-documentdb_*_arm64.deb
    ├── postgresql-17-documentdb_*_amd64.deb
    ├── postgresql-17-documentdb_*_arm64.deb
    ├── postgresql15-documentdb-*.x86_64.rpm
    ├── postgresql15-documentdb-*.aarch64.rpm
    ├── postgresql16-documentdb-*.x86_64.rpm
    ├── postgresql16-documentdb-*.aarch64.rpm
    ├── postgresql17-documentdb-*.x86_64.rpm
    └── postgresql17-documentdb-*.aarch64.rpm
```

## Direct Downloads

**Repository packages:** https://documentdb.github.io/packages/

**GitHub releases:** https://github.com/documentdb/documentdb/releases