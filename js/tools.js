$(document).ready(function () {
  $('#decodeButton').click(function () {
    decodeAddress()
  })

  $('#generateWalletButton').click(function () {
    generateWallet(true)
  })

  $('#walletAddress').keydown(function (e) {
    if (e.which === 13) {
      decodeAddress()
    }
  })

  $('#restoreFromSeedButton').click(function () {
    $('#mnemonic').val('')
    generateWallet(false)
  })

  $('#restoreFromMnemonicButton').click(function () {
    $('#seed').val('')
    generateWallet(false)
  })

  $('#encodeAddressButton').click(function () {
    encodeAddress()
  })

  $('#generateRandomPaymentIDButton').click(function () {
    generateRandomPaymentID()
  })

  window.cnUtils = new TurtleCoinUtils.CryptoNote({
    coinUnitPlaces: ExplorerConfig.decimalPoints,
    addressPrefix: ExplorerConfig.addressPrefix
  })
})

function generateWallet(newWallet) {
  const entropy = $('#entropy').val().trim()
  if (newWallet) {
    $('#seed').val('')
    $('#mnemonic').val('')
  }
  const seed = $('#seed').val().trim()
  const mnemonic = $('#mnemonic').val().trim().toLowerCase()

  $('#newPrivateSpendKey').val('')
  $('#newPublicSpendKey').val('')
  $('#newPrivateViewKey').val('')
  $('#newPublicViewKey').val('')
  $('#newWalletAddress').val('')

  $('#entropy').removeClass('is-danger')
  $('#seed').removeClass('is-danger')
  $('#mnemonic').removeClass('is-danger')

  var wallet

  if (entropy.length !== 0 && newWallet) {
    wallet = cnUtils.createNewAddress(entropy)
  } else if (seed.length !== 0) {
    if (!isHash(seed)) {
      return $('#seed').addClass('is-danger')
    }
    wallet = cnUtils.createAddressFromSeed(seed)
  } else if (mnemonic.length !== 0) {
    if ((mnemonic.split(' ')).length !== 25) {
      return $('#mnemonic').addClass('is-danger')
    }
    wallet = cnUtils.createAddressFromMnemonic(mnemonic)
  } else if (newWallet) {
    wallet = cnUtils.createNewAddress()
  }

  if (!wallet) return

  $('#seed').val(wallet.seed)
  $('#mnemonic').val(wallet.mnemonic)
  $('#newPrivateSpendKey').val(wallet.spend.privateKey)
  $('#newPublicSpendKey').val(wallet.spend.publicKey)
  $('#newPrivateViewKey').val(wallet.view.privateKey)
  $('#newPublicViewKey').val(wallet.view.publicKey)
  $('#newWalletAddress').val(wallet.address)

  return true
}

function decodeAddress() {
  const walletAddress = $('#walletAddress').val()

  try {
    const addr = cnUtils.decodeAddress(walletAddress)

    $('#publicViewKey').val(addr.publicViewKey)
    $('#publicSpendKey').val(addr.publicSpendKey)
    $('#paymentId').val(addr.paymentId)
    $('#walletAddress').removeClass('is-danger')
    $('#encodedAddress').val(walletAddress)
  } catch (e) {
    $('#walletAddress').removeClass('is-danger').addClass('is-danger')
  }
}

function encodeAddress() {
  const publicViewKey = $('#publicViewKey').val().trim()
  const publicSpendKey = $('#publicSpendKey').val().trim()
  const paymentId = $('#paymentId').val().trim()

  $('#publicViewKey').removeClass('is-danger')
  $('#publicSpendKey').removeClass('is-danger')
  $('#paymentId').removeClass('is-danger')
  $('#encodedAddress').removeClass('is-danger')

  if (!isHash(publicSpendKey)) {
    return $('#publicSpendKey').addClass('is-danger')
  }

  if (!isHash(publicViewKey)) {
    return $('#publicViewKey').addClass('is-danger')
  }

  if (paymentId.length !== 0 && !isHash(paymentId)) {
    return $('#paymentId').addClass('is-danger')
  }

  try {
    const addr = cnUtils.encodeAddress(publicViewKey, publicSpendKey, paymentId)
    $('#encodedAddress').val(addr)
  } catch (e) {
    $('#encodedAddress').removeClass('is-danger').addClass('is-danger')
  }
}

function generateRandomPaymentID() {
  const random = cnUtils.createNewSeed((new Date()).toString()).toUpperCase()

  $('#paymentId').val(random)
}