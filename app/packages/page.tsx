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
        <div className="space-y-6 mb-12">
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
                # Add repository with GPG verification
                <br />
                curl -fsSL https://documentdb.io/documentdb-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/documentdb-archive-keyring.gpg
                <br />
                echo &quot;deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/documentdb-archive-keyring.gpg] https://documentdb.io/deb stable main&quot; | sudo tee /etc/apt/sources.list.d/documentdb.list
                <br />
                <br />
                # Install packages
                <br />
                sudo apt update &amp;&amp; sudo apt install postgresql-16-documentdb
              </code>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                <strong>Supports:</strong> Debian 11/12, Ubuntu 22.04/24.04
              </span>
              <span className="text-blue-400">
                AMD64 + ARM64
              </span>
            </div>
          </div>

          {/* RHEL/CentOS/Fedora Card */}
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">RHEL/CentOS</h3>
            </div>

            <div className="bg-neutral-900 rounded p-4 mb-4">
              <code className="text-sm text-green-400 break-all">
                # Enable CRB repo (for dependencies)
                <br />
                sudo dnf install -y dnf-plugins-core
                <br />
                sudo dnf config-manager --set-enabled crb
                <br />
                <br />
                # Add repository with GPG verification
                <br />
                sudo rpm --import https://documentdb.io/documentdb-archive-keyring.gpg
                <br />
                echo &apos;[documentdb]
                <br />
                name=DocumentDB Repository
                <br />
                baseurl=https://documentdb.io/rpm/rhel9
                <br />
                enabled=1
                <br />
                gpgcheck=1
                <br />
                gpgkey=https://documentdb.io/documentdb-archive-keyring.gpg&apos; | sudo tee /etc/yum.repos.d/documentdb.repo
                <br />
                <br />
                # Install packages
                <br />
                sudo dnf install postgresql16-documentdb
              </code>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                <strong>Supports:</strong> RHEL 8/9, Rocky, AlmaLinux, CentOS Stream
              </span>
              <span className="text-red-400">
                x86_64 + aarch64
              </span>
            </div>
          </div>
        </div>

        {/* Installation Guide Link */}
        <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-lg p-6 border border-blue-500/30 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">📖 Complete Installation Guide</h2>
              <p className="text-gray-400">
                Detailed instructions for all distributions, GPG verification, troubleshooting, etc
              </p>
            </div>
            <Link 
              href="https://github.com/documentdb/documentdb.github.io/blob/main/PACKAGE-INSTALL.md" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              target="_blank"
            >
              View Guide
            </Link>
          </div>
        </div>

        {/* Alternative Installation Methods */}
        <div className="bg-neutral-800 rounded-lg p-8 border border-neutral-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Alternative Installation Methods</h2>
          
          {/* Direct Downloads */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-purple-400 mb-3">
              Direct Package Downloads
            </h3>
            <p className="text-gray-400 mb-4">
              Browse and download individual packages without setting up repositories.
            </p>
          </div>

          {/* Manual Installation */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-blue-400 mb-2">Manual Installation</h4>
            <p className="text-gray-300 text-sm">
              For one-time installations, you can download and install packages manually:
            </p>
            <div className="bg-neutral-900 rounded p-3 mt-3">
              <code className="text-xs text-green-400">
                # Example: Direct .deb installation<br/>
                wget https://documentdb.io/packages/ubuntu22.04-postgresql-16-documentdb_0.107-0_amd64.deb<br/>
                sudo dpkg -i ubuntu22.04-postgresql-16-documentdb_0.107-0_amd64.deb<br/>
                <br/>
                # Example: Direct .rpm installation<br/>
                wget https://documentdb.io/packages/rhel8-postgresql16-documentdb-0.107.0-1.el8.x86_64.rpm<br/>
                sudo rpm -i rhel8-postgresql16-documentdb-0.107.0-1.el8.x86_64.rpm
              </code>
            </div>
          </div>
        </div>

        {/* Package Information */}
        <div className="bg-neutral-800 rounded-lg p-8 border border-neutral-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Available Packages</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                APT Packages
              </h3>
              <div className="text-sm text-gray-400 mb-2">
                Debian 11/12, Ubuntu 22.04/24.04
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• postgresql-15-documentdb</li>
                <li>• postgresql-16-documentdb</li>
                <li>• postgresql-17-documentdb</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                RPM Packages  
              </h3>
              <div className="text-sm text-gray-400 mb-2">
                RHEL 8/9, CentOS, Fedora
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• postgresql16-documentdb</li>
                <li>• postgresql17-documentdb</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-green-300 font-semibold mb-1">Multi-Architecture Support</p>
                <p className="text-green-200 text-sm">
                  All packages support both AMD64 and ARM64 architectures (including Apple Silicon, AWS Graviton, etc.)
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
