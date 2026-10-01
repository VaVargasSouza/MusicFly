import { criarUsuario } from "./database.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import { app } from "./firebase.js";

const auth = getAuth(app);

// CADASTRO

export async function cadastrarUsuario(email, senha) {

    try {

        const usuario = await createUserWithEmailAndPassword(
            auth,
            email,
            senha
        );

        console.log("Usuário cadastrado:", usuario.user);

        return usuario.user;

    } catch (erro) {

        console.error("Erro ao cadastrar:", erro);

        throw erro;
    }
}

// LOGIN

export async function cadastrarUsuario(email, senha, nome) {

    try {

        const resultado =
            await createUserWithEmailAndPassword(
                auth,
                email,
                senha
            );

        const usuario = resultado.user;


        // Salvar informações no Firestore
        await criarUsuario(usuario.uid, {

            nome: nome,
            email: email,
            tipo: "usuario",
            criadoEm: new Date()

        });


        console.log(
            "Usuário cadastrado e salvo no Firestore!"
        );


        return usuario;

    } catch (erro) {

        console.error(
            "Erro ao cadastrar:",
            erro
        );

        throw erro;
    }
}

// LOGOUT

export async function fazerLogout() {

    try {

        await signOut(auth);

        console.log("Usuário saiu da conta.");

    } catch (erro) {

        console.error("Erro ao sair:", erro);

        throw erro;
    }
}

// VERIFICAR USUÁRIO LOGADO

export function observarUsuario(callback) {

    onAuthStateChanged(auth, (usuario) => {

        if (usuario) {

            console.log("Usuário conectado:", usuario.email);

            callback(usuario);

        } else {

            console.log("Nenhum usuário conectado.");

            callback(null);
        }

    });
}

export { auth };