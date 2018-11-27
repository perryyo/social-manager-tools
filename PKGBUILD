# Maintainer: Patryk Rzucidło (PTKDev) <support@ptkdev.io>

pkgname=social-manager-tools
pkgver=0.6.2
pkgrel=1
pkgdesc="Bot for Instagram, Twitter, Facebook and Telegram"
arch=('x86_64')
url="https://github.com/social-manager-tools"
license=('AGPLv3')
install=${pkgname}.install

source=('social-manager-tools.desktop')
source_x86_64=("https://github.com/social-manager-tools/social-manager-tools/releases/download/0.6.2/Social.Manager.Tools-0.6.2.tar.gz")

sha256sums_x86_64=('3d7f04368628fcf795d9154b5684aa6fc3740790c5819bc670a77e52a1dd91ca')

package() {
  cd "${srcdir}"

  install -dm755 "${pkgdir}/opt"
  cp --preserve=mode -r "social-manager-tools" "${pkgdir}/opt/social-manager-tools"

  for res in 256x256 48x48 32x32 24x24 16x16; do
    install -dm755 "${pkgdir}/usr/share/icons/hicolor/${res}/apps"
    ln -s "/opt/social-manager-tools/icons/${res}.png" "${pkgdir}/usr/share/icons/hicolor/${res}/apps/social-manager-tools.png"
  done

  install -dm755 "${pkgdir}/usr/share/applications"
  install -Dm644 "social-manager-tools.desktop" "${pkgdir}/usr/share/applications/social-manager-tools.desktop"

  install -dm755 "${pkgdir}/usr/bin"
  ln -s "/opt/social-manager-tools/social-manager-tools" "${pkgdir}/usr/bin/social-manager-tools"
}