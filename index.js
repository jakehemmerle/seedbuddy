const {
  mnemonicGenerate, mnemonicToMiniSecret, mnemonicValidate, naclKeypairFromSeed, encodeAddress,
} = require('@polkadot/util-crypto');

function generateAndVerifyMnemonic() {
  const arrayEquals = (a, b) => (a.length === b.length
    && a.every((val, index) => val === b[index]));

  // Create mnemonic string for Alice using BIP39
  const mnemonicAlice = mnemonicGenerate();
  console.log(`Testing with seed: ${mnemonicAlice}`);

  // Validate the mnemonic string
  const isValidMnemonic = mnemonicValidate(mnemonicAlice);
  if (!isValidMnemonic) {
    console.error(`Invalid mnemonic generated: ${mnemonicAlice}`);
    return 1;
  }

  // convert to substrate compatable seed
  const seed = mnemonicToMiniSecret(mnemonicAlice);
  const { publicKey, secretKey } = naclKeypairFromSeed(seed);
  const address = encodeAddress(publicKey);

  // test all parts of the seed to address functions
  for (let i = 1; i <= 100; i++) {
    const testSeed = mnemonicToMiniSecret(mnemonicAlice);
    const { publicKey: publicKeyTest, secretKey: secretKeyTest } = naclKeypairFromSeed(testSeed);
    const addressTest = encodeAddress(publicKeyTest);

    const sameSeed = arrayEquals(seed, testSeed);
    const samePubKey = arrayEquals(publicKey, publicKeyTest);
    const sameSecretKey = arrayEquals(secretKey, secretKeyTest);
    const sameAddress = address == addressTest;

    if (!(
      sameSeed
      && samePubKey
      && sameSecretKey
      && sameAddress
    )) {
      console.error('Generation error detected!');
      console.error(`seed expected:  ${seed}`);
      console.error(`seed generated: ${testSeed}`);
      console.error(`publicKey expected:  ${publicKey}`);
      console.error(`publicKey generated: ${publicKeyTest}`);
      console.error(`secretKey expected:  ${secretKey}`);
      console.error(`secretKey generated: ${secretKeyTest}`);
      console.error(`address expected:  ${address}`);
      console.error(`address generated: ${addressTest}`);
      console.error(`iteration: ${i}`);

      return 0;
    }
    if (!(i % 10)) console.log(`${i}...`);
  }
  console.log('All were generated properly!');
}

while (true) generateAndVerifyMnemonic();
