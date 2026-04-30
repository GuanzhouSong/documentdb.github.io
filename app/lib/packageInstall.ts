export type AptDistro = "ubuntu22" | "ubuntu24" | "deb11" | "deb12" | "deb13";
export type RpmDistro = "rhel8" | "rhel9";
export type AptArch = "amd64" | "arm64";
export type RpmArch = "x86_64" | "aarch64";
export type AptPgVersion = "16" | "17" | "18";
export type RpmPgVersion = "16" | "17" | "18";

export const aptTargetLabels: Record<AptDistro, string> = {
  ubuntu22: "Ubuntu 22.04 (Jammy)",
  ubuntu24: "Ubuntu 24.04 (Noble)",
  deb11: "Debian 11 (Bullseye)",
  deb12: "Debian 12 (Bookworm)",
  deb13: "Debian 13 (Trixie)",
};

export const rpmTargetLabels: Record<RpmDistro, string> = {
  rhel8: "RHEL-compatible 8 (tested on Rocky Linux 8)",
  rhel9: "RHEL-compatible 9 (tested on Rocky Linux 9)",
};

export const aptTargetPgVersions: Record<AptDistro, AptPgVersion[]> = {
  ubuntu22: ["16", "17", "18"],
  ubuntu24: ["16", "17", "18"],
  deb11: ["16", "17"],
  deb12: ["16", "17", "18"],
  deb13: ["16", "17", "18"],
};

const aptPgdgSuites: Record<AptDistro, string> = {
  ubuntu22: "jammy",
  ubuntu24: "noble",
  deb11: "bullseye",
  deb12: "bookworm",
  deb13: "trixie",
};

const rpmMajorVersions: Record<RpmDistro, "8" | "9"> = {
  rhel8: "8",
  rhel9: "9",
};

export function buildAptInstallCommand(
  aptTarget: AptDistro,
  aptArch: AptArch,
  aptPgVersion: AptPgVersion,
): string {
  const pgdgSuite = aptPgdgSuites[aptTarget];

  return `sudo apt update && \\
sudo apt install -y curl ca-certificates gnupg && \\
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor --yes -o /usr/share/keyrings/postgresql.gpg && \\
echo "deb [signed-by=/usr/share/keyrings/postgresql.gpg] https://apt.postgresql.org/pub/repos/apt ${pgdgSuite}-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list >/dev/null && \\
curl -fsSL https://documentdb.io/documentdb-archive-keyring.gpg | sudo gpg --dearmor --yes -o /usr/share/keyrings/documentdb-archive-keyring.gpg && \\
echo "deb [arch=${aptArch} signed-by=/usr/share/keyrings/documentdb-archive-keyring.gpg] https://documentdb.io/deb stable ${aptTarget}" | sudo tee /etc/apt/sources.list.d/documentdb.list >/dev/null && \\
sudo apt update && \\
sudo apt install -y postgresql-${aptPgVersion}-documentdb`;
}

export function buildRpmInstallCommand(
  rpmTarget: RpmDistro,
  rpmArch: RpmArch,
  rpmPgVersion: RpmPgVersion,
): string {
  const rhelMajorVersion = rpmMajorVersions[rpmTarget];

  return `sudo dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-${rhelMajorVersion}.noarch.rpm && \\
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-${rhelMajorVersion}-${rpmArch}/pgdg-redhat-repo-latest.noarch.rpm && \\
sudo dnf -qy module disable postgresql && \\
sudo dnf install -y dnf-plugins-core && \\
(sudo dnf config-manager --set-enabled crb || \\
 sudo dnf config-manager --set-enabled powertools || \\
 sudo dnf config-manager --set-enabled codeready-builder-for-rhel-${rhelMajorVersion}-${rpmArch}-rpms) && \\
sudo rpm --import https://documentdb.io/documentdb-archive-keyring.gpg && \\
printf '%s\\n' \\
  '[documentdb]' \\
  'name=DocumentDB Repository' \\
  'baseurl=https://documentdb.io/rpm/${rpmTarget}' \\
  'enabled=1' \\
  'gpgcheck=1' \\
  'gpgkey=https://documentdb.io/documentdb-archive-keyring.gpg' | sudo tee /etc/yum.repos.d/documentdb.repo >/dev/null && \\
sudo dnf install -y postgresql${rpmPgVersion}-documentdb`;
}
