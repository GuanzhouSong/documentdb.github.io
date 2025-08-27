export default function Blogs() {
  return (
    <div className="min-h-screen bg-neutral-900 relative overflow-hidden">
      {/* Artistic background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-32 right-32 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-500 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/2 w-36 h-36 bg-orange-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/4 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-3 h-3 bg-green-400 rounded-full opacity-50 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "2.5s" }}
        ></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6">
            Latest from our Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Insights, updates, and deep dives into the world of document
            databases and open-source innovation
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 mx-auto rounded-full"></div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-12 mb-12">
          {/* Featured Blog - DocumentDB Joins the Linux Foundation */}
          <div>
            <article className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-neutral-800/80 backdrop-blur-sm rounded-2xl border border-neutral-700/50 hover:border-blue-500/50 transition-all duration-500 group-hover:transform group-hover:scale-[1.02] overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-blue-400 text-sm font-medium">
                        Microsoft Open Source Blog
                      </span>
                      <p className="text-gray-500 text-xs">August 25, 2025</p>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    DocumentDB Joins the Linux Foundation
                  </h2>

                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Today, we are excited to announce yet another milestone in
                    DocumentDB’s journey: the project is officially joining the
                    Linux Foundation.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                      Open Source
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                      PostgreSQL
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                      MIT License
                    </span>
                  </div>

                  <a
                    href="https://opensource.microsoft.com/blog/2025/08/25/documentdb-joins-the-linux-foundation/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Read full article
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          </div>

          {/* Blog 2 - AWS joins the DocumentDB project */}
          <article className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-neutral-800/80 backdrop-blur-sm rounded-2xl border border-neutral-700/50 hover:border-orange-500/50 transition-all duration-500 group-hover:transform group-hover:scale-105 overflow-hidden h-full">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-orange-400 text-sm font-medium">
                      AWS Blogs
                    </span>
                    <p className="text-gray-500 text-xs">Recent</p>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
                  AWS : DocumentDB Project Announcement
                </h2>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  AWS joins the DocumentDB project to build interoperable, open source document database technology
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">
                    Community
                  </span>
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">
                    Growth
                  </span>
                </div>
                <a
                  href="https://aws.amazon.com/blogs/opensource/aws-joins-the-documentdb-project-to-build-interoperable-open-source-document-database-technology/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors font-medium text-sm"
                >
                  Read more
                  <svg
                    className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </article>
          
          {/* Blog 3 - DocumentDB Open Source Announcement */}
          <article className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-neutral-800/80 backdrop-blur-sm rounded-2xl border border-neutral-700/50 hover:border-purple-500/50 transition-all duration-500 group-hover:transform group-hover:scale-105 overflow-hidden h-full">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-purple-400 text-sm font-medium">
                      Azure Cosmos DB Blog
                    </span>
                    <p className="text-gray-500 text-xs">Recent</p>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  DocumentDB: Open-Source Announcement
                </h2>

                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  We are excited to announce the official release of
                  DocumentDB—an open-source document database platform and the
                  engine powering the vCore-based Azure Cosmos DB for MongoDB,
                  built on PostgreSQL. This marks a significant milestone in
                  creating an interoperable, portable, and fully supported
                  production-ready document data store.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                    Community
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                    Growth
                  </span>
                </div>

                <a
                  href="https://opensource.microsoft.com/blog/2025/01/23/documentdb-open-source-announcement/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors font-medium text-sm"
                >
                  Read more
                  <svg
                    className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </article>

          {/* Blog 4 - DocumentDB Gaining Momentum */}
          <article className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-neutral-800/80 backdrop-blur-sm rounded-2xl border border-neutral-700/50 hover:border-purple-500/50 transition-all duration-500 group-hover:transform group-hover:scale-105 overflow-hidden h-full">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-purple-400 text-sm font-medium">
                      Azure Cosmos DB Blog
                    </span>
                    <p className="text-gray-500 text-xs">Recent</p>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  DocumentDB is Gaining Momentum in the Open-Source Database
                  World
                </h2>

                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  DocumentDB has quickly caught the attention of major tech
                  publications and earned significant community engagement. In
                  just under a week, our project earned 1000 GitHub stars,
                  nearly 50 forks, and multiple pull requests.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                    Community
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                    Growth
                  </span>
                </div>

                <a
                  href="https://devblogs.microsoft.com/cosmosdb/documentdb-is-gaining-momentum-in-the-open-source-database-world/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors font-medium text-sm"
                >
                  Read more
                  <svg
                    className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </article>

          {/* Blog 5 - YugabyteDB MongoDB API */}
          <article className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-neutral-800/80 backdrop-blur-sm rounded-2xl border border-neutral-700/50 hover:border-green-500/50 transition-all duration-500 group-hover:transform group-hover:scale-105 overflow-hidden h-full">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-green-400 text-sm font-medium">
                      YugabyteDB Blog
                    </span>
                    <p className="text-gray-500 text-xs">Partner Content</p>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors">
                  MongoDB API in YugabyteDB
                </h2>

                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  Learn how YugabyteDB now offers a MongoDB-compatible API with
                  the support of the DocumentDB PostgreSQL extension, providing
                  developers with an open source alternative for MongoDB
                  workloads.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    MongoDB API
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                    Distributed
                  </span>
                </div>

                <a
                  href="https://www.yugabyte.com/blog/mongodb-api-in-yugabytedb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors font-medium text-sm"
                >
                  Read more
                  <svg
                    className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
