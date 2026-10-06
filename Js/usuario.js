import {
    cadastrarUsuario,
    fazerLogin,
    fazerLogout
} from "./auth.js";


// ========================================
// UID DO ADMINISTRADOR
// ========================================

const UID_ADMIN =
    "QjjdnmbhsbVkN57Y8gRZw1c154y1";


// ========================================
// CADASTRAR
// ========================================

document
    .getElementById("cadastrar")
    .addEventListener(
        "click",
        async () => {

            const nome =
                document
                    .getElementById("nome")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const senha =
                document
                    .getElementById("senha")
                    .value;


            if (
                !nome ||
                !email ||
                !senha
            ) {

                alert(
                    "Preencha todos os campos."
                );

                return;
            }


            try {

                await cadastrarUsuario(
                    email,
                    senha,
                    nome
                );


                alert(
                    "Cadastro realizado com sucesso!"
                );


            } catch (erro) {

                console.error(
                    "Erro no cadastro:",
                    erro
                );


                alert(
                    "Erro: " +
                    erro.message
                );
            }
        }
    );


// ========================================
// LOGIN
// ========================================

document
    .getElementById("login")
    .addEventListener(
        "click",
        async () => {

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const senha =
                document
                    .getElementById("senha")
                    .value;


            if (
                !email ||
                !senha
            ) {

                alert(
                    "Digite o e-mail e a senha."
                );

                return;
            }


            try {

                const usuario =
                    await fazerLogin(
                        email,
                        senha
                    );


                console.log(
                    "UID do usuário:",
                    usuario.uid
                );


                // ========================================
                // VERIFICA SE É ADMIN PELO UID
                // ========================================

                if (
                    usuario.uid === UID_ADMIN
                ) {

                    console.log(
                        "Usuário administrador."
                    );


                    window.location.replace(
                        "./admin.html"
                    );

                } else {

                    console.log(
                        "Usuário comum."
                    );


                    window.location.replace(
                        "./main.html"
                    );
                }


            } catch (erro) {

                console.error(
                    "Erro no login:",
                    erro
                );


                alert(
                    "Erro: " +
                    erro.message
                );
            }
        }
    );


// ========================================
// LOGOUT
// ========================================

document
    .getElementById("logout")
    .addEventListener(
        "click",
        async () => {

            try {

                await fazerLogout();


                alert(
                    "Você saiu da conta!"
                );


            } catch (erro) {

                console.error(
                    "Erro ao sair:",
                    erro
                );


                alert(
                    "Erro: " +
                    erro.message
                );
            }
        }
    );