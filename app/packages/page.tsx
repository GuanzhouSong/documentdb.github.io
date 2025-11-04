import Link from "next/link";

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-neutral-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            📦 DocumentDB Package Repository
          </h1>
          <p className="text-xl text-gray-400 mb-4">
            Official APT and YUM repositories for DocumentDB packages
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
              🔐 GPG Signed
            </span>
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
              🐧 Multi-Distribution
            </span>
            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30">
              🔄 Auto-Updates
            </span>
          </div>
        </div>

        {/* Quick Install Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Debian/Ubuntu Card */}
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Debian/Ubuntu</h3>
            </div>
            <div className="bg-neutral-900 rounded p-4 mb-4">
              <code className="text-sm text-green-400 break-all">
                # Install GPG key (recommended)
                <br />
                curl -fsSL https://documentdb.github.io/documentdb-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/documentdb-archive-keyring.gpg
                <br />
                <br />
                # Add signed repository (AMD64 & ARM64)
                <br />
                echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/documentdb-archive-keyring.gpg] https://documentdb.github.io/deb stable main" | sudo tee /etc/apt/sources.list.d/documentdb.list
                <br />
                <br />
                # Update and install
                <br />
                sudo apt-get update
                <br />
                sudo apt-get install postgresql-16-documentdb
              </code>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              <strong>Multi-architecture:</strong> Supports both AMD64 and ARM64 (Apple Silicon, AWS Graviton, etc.)
            </p>
            <p className="text-sm text-gray-400 mb-2">
              <strong>Quick install (no GPG verification):</strong> Add <code className="bg-neutral-700 px-1 rounded">trusted=yes</code> instead of GPG key
            </p>
          </div>

          {/* RHEL/CentOS/Fedora Card */}
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">RHEL</h3>
            </div>
            <div className="bg-neutral-900 rounded p-4 mb-4">
              <code className="text-sm text-green-400 break-all">
                # Import GPG key (recommended)
                <br />
                curl -fsSL https://documentdb.github.io/documentdb-archive-keyring.gpg | sudo rpm --import -
                <br />
                <br />
                # Add signed repository
                <br />
                sudo tee /etc/yum.repos.d/documentdb.repo &lt;&lt;EOF
                <br />
                [documentdb]
                <br />
                name=DocumentDB Repository
                <br />
                baseurl=https://documentdb.github.io/rpm/rhel8
                <br />
                enabled=1
                <br />
                gpgcheck=1
                <br />
                gpgkey=https://documentdb.github.io/documentdb-archive-keyring.gpg
                <br />
                EOF
                <br />
                <br />
                # Install DocumentDB
                <br />
                sudo yum install postgresql16-documentdb
              </code>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              <strong>Multi-architecture:</strong> Supports both x86_64 and aarch64 (AWS Graviton, etc.)
            </p>
            <p className="text-sm text-gray-400 mb-2">
              <strong>Quick install (no GPG verification):</strong> Set <code className="bg-neutral-700 px-1 rounded">gpgcheck=0</code> instead of importing GPG key
            </p>
          </div>
        </div>

        {/* Installation Guide Link */}
        <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-lg p-6 border border-blue-500/30 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">📖 Complete Installation Guide</h2>
              <p className="text-gray-400">
                Detailed instructions for all distributions, GPG verification, troubleshooting, and automation scripts
              </p>
            </div>
            <Link 
              href="/PACKAGE-INSTALL.md" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              target="_blank"
            >
              View Guide
            </Link>
          </div>
        </div>

        {/* Manual Setup Section */}
        <div className="bg-neutral-800 rounded-lg p-8 border border-neutral-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Distribution-Specific Setup</h2>
          
          {/* APT Manual Setup */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-blue-400 mb-3">
              APT Repository (Debian/Ubuntu)
            </h3>
            <div className="bg-neutral-900 rounded p-4">
              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>{`# Option 1: With GPG verification (recommended)
curl -fsSL https://documentdb.github.io/documentdb-archive-keyring.gpg | \\
  sudo gpg --dearmor -o /usr/share/keyrings/documentdb-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/documentdb-archive-keyring.gpg] https://documentdb.github.io/deb stable main" | \\
  sudo tee /etc/apt/sources.list.d/documentdb.list

# Option 2: Quick install (no GPG verification)  
echo "deb [arch=amd64 trusted=yes] https://documentdb.github.io/deb stable main" | \\
  sudo tee /etc/apt/sources.list.d/documentdb.list

sudo apt-get update
sudo apt-get install postgresql-16-documentdb
# Available: postgresql-15-documentdb, postgresql-16-documentdb, postgresql-17-documentdb`}</code>
              </pre>
            </div>
          </div>

          {/* YUM Manual Setup */}
          <div>
            <h3 className="text-xl font-semibold text-red-400 mb-3">
              YUM Repository (RHEL/CentOS/Fedora)
            </h3>
            <div className="bg-neutral-900 rounded p-4">
              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>{`# Option 1: With GPG verification (recommended)
curl -fsSL https://documentdb.github.io/documentdb-archive-keyring.gpg | sudo rpm --import -
sudo tee /etc/yum.repos.d/documentdb.repo <<EOF
[documentdb]
name=DocumentDB Repository
baseurl=https://documentdb.github.io/rpm/rhel8
enabled=1
gpgcheck=1
gpgkey=https://documentdb.github.io/documentdb-archive-keyring.gpg
EOF

# Option 2: Quick install (no GPG verification)
sudo tee /etc/yum.repos.d/documentdb.repo <<EOF
[documentdb]
name=DocumentDB Repository  
baseurl=https://documentdb.github.io/rpm/rhel8
enabled=1
gpgcheck=0
EOF

sudo yum install postgresql16-documentdb
# Available: postgresql16-documentdb, postgresql17-documentdb`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Direct Downloads */}
        <div className="bg-neutral-800 rounded-lg p-8 border border-neutral-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Direct Downloads</h2>
          <p className="text-gray-400 mb-4">
            Browse and download packages directly without adding the repository.
          </p>
          <a
            href="https://documentdb.github.io/packages/"
            className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Browse All Packages
          </a>
        </div>

        {/* Repository Information */}
        <div className="bg-neutral-800 rounded-lg p-8 border border-neutral-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Repository Information</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <div>
                <strong className="text-white">APT Repository:</strong>{" "}
                <code className="text-green-400 bg-neutral-900 px-2 py-1 rounded">
                  https://documentdb.github.io/deb
                </code>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <div>
                <strong className="text-white">YUM Repository:</strong>{" "}
                <code className="text-green-400 bg-neutral-900 px-2 py-1 rounded">
                  https://documentdb.github.io/rpm
                </code>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <div>
                <strong className="text-white">Package Browser:</strong>{" "}
                <a
                  href="https://documentdb.github.io/packages/"
                  className="text-blue-400 hover:text-blue-300"
                >
                  https://documentdb.github.io/packages/
                </a>
              </div>
            </li>
          </ul>
        </div>

        {/* Package Information */}
        <div className="bg-neutral-800 rounded-lg p-8 border border-neutral-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Available Packages</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">APT Packages (Debian/Ubuntu)</h3>
              <ul className="space-y-2 text-gray-300">
                <li><code className="text-green-400">postgresql-15-documentdb</code> - DocumentDB extension for PostgreSQL 15</li>
                <li><code className="text-green-400">postgresql-16-documentdb</code> - DocumentDB extension for PostgreSQL 16</li>
                <li><code className="text-green-400">postgresql-17-documentdb</code> - DocumentDB extension for PostgreSQL 17</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-2">RPM Packages (RHEL/CentOS/Fedora)</h3>
              <ul className="space-y-2 text-gray-300">
                <li><code className="text-green-400">postgresql16-documentdb</code> - DocumentDB extension for PostgreSQL 16</li>
                <li><code className="text-green-400">postgresql17-documentdb</code> - DocumentDB extension for PostgreSQL 17</li>
              </ul>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
              <p className="text-yellow-300">
                <strong>Note:</strong> These packages are currently unsigned. Use the <code className="text-yellow-400">trusted=yes</code> flag for APT or <code className="text-yellow-400">gpgcheck=0</code> for YUM as shown in the examples above.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
