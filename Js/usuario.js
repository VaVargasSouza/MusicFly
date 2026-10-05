import {
    cadastrarUsuario,
    fazerLogin,
    fazerLogout
} from "./auth.js";


// ========================================
// CADASTRO
// ========================================

document
    .getElementById("cadastrar")
    .addEventListener("click", async () => {

        const nome =
            document.getElementById("nome").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const senha =
            document.getElementById("senha").value;


        if (!nome || !email || !senha) {
            alert("Preencha todos os campos.");
            return;
        }


        try {

            await cadastrarUsuario(
                email,
                senha,
                nome
            );

            alert("Cadastro realizado!");

        } catch (erro) {

            console.error(
                "Erro no cadastro:",
                erro
            );

            alert(
                "Erro: " + erro.message
            );
        }

    });


// ========================================
// LOGIN
// ========================================

document
    .getElementById("login")
    .addEventListener("click", async () => {

        const email =
            document.getElementById("email").value.trim();

        const senha =
            document.getElementById("senha").value;


        if (!email || !senha) {
            alert("Digite o e-mail e a senha.");
            return;
        }


        try {

            await fazerLogin(
                email,
                senha
            );

            alert("Login realizado!");

            window.location.href =
                "./admin.html";

        } catch (erro) {

            console.error(
                "Erro no login:",
                erro
            );

            alert(
                "Erro: " + erro.message
            );
        }

    });


// ========================================
// LOGOUT
// ========================================

document
    .getElementById("logout")
    .addEventListener("click", async () => {

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
                "Erro: " + erro.message
            );
        }

    });