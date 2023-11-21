let key = '';
  const caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < 16; i++) {
    key += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  console.log(key);

/* ====================================================================================== */

  const lista_caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let grupo5Fake = '';
  for (let i = 0; i < 4; i++) {
    grupo5Fake += lista_caracteres.charAt(Math.floor(Math.random() * lista_caracteres.length));
  }
  let key2 = key;
  key2 = key2.split('').reverse().join('');

  let grupo1 = key2.slice(0, 4);
  let grupo2 = key2.slice(4, 8);
  let grupo3 = key2.slice(8, 12);
  let grupo4 = key2.slice(12, 16);
  let grupo5FakeInverse = grupo5Fake.split('').reverse().join('');
  let response = `$2a$${grupo4}${grupo5Fake}${grupo2}${grupo5FakeInverse}${grupo1}${grupo5Fake}${grupo3}`;
  console.log(response);



  /* ====================================================================================== */


  let resposeEncript = response;
  const grupo1Encript_fake1 = resposeEncript.slice(0, 4);
  const grupo2Encript_4 = resposeEncript.slice(4, 8);
  const grupo3Encript_fake2 = resposeEncript.slice(8, 12);
  const grupo4Encript_2 = resposeEncript.slice(12, 16);
  const grupo5Encript_fake3 = resposeEncript.slice(16, 20);
  const grupo6Encript_1 = resposeEncript.slice(20, 24);
  const grupo7Encript_fake4 = resposeEncript.slice(24, 28);
  const grupo8Encript_3 = resposeEncript.slice(28, 32);

  let decrytCode = `${grupo6Encript_1}${grupo4Encript_2}${grupo8Encript_3}${grupo2Encript_4}`;
  const decodeCode = decrytCode.split('').reverse().join('');
  console.log(decodeCode);
