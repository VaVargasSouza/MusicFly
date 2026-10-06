import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import { app } from "./firebase.js";

const auth = getAuth(app);


// ========================================
// CADASTRO
// ========================================

export async function cadastrarUsuario(email, senha, nome) {

    try {

        const resultado =
            await createUserWithEmailAndPassword(
                auth,
                email,
                senha
            );

        const usuario = resultado.user;


        // Salva o nome diretamente no Firebase Authentication
        await updateProfile(usuario, {
            displayName: nome
        });


        console.log(
            "Usuário cadastrado com sucesso:",
            usuario.email
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


// ========================================
// LOGIN
// ========================================

export async function fazerLogin(email, senha) {

    try {

        const resultado =
            await signInWithEmailAndPassword(
                auth,
                email,
                senha
            );


        console.log(
            "Login realizado:",
            resultado.user.email
        );


        return resultado.user;

    } catch (erro) {

        console.error(
            "Erro ao fazer login:",
            erro
        );

        throw erro;
    }
}


// ========================================
// LOGOUT
// ========================================

export async function fazerLogout() {

    try {

        await signOut(auth);


        console.log(
            "Usuário saiu da conta."
        );

    } catch (erro) {

        console.error(
            "Erro ao sair:",
            erro
        );

        throw erro;
    }
}


// ========================================
// VERIFICAR USUÁRIO LOGADO
// ========================================

export function observarUsuario(callback) {

    return onAuthStateChanged(
        auth,
        (usuario) => {

            if (usuario) {

                console.log(
                    "Usuário conectado:",
                    usuario.email
                );

            } else {

                console.log(
                    "Nenhum usuário conectado."
                );
            }


            callback(usuario);
        }
    );
}


export { auth };
