import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import { app } from "./firebase.js";

const db = getFirestore(app);


// Criar usuário no Firestore
export async function criarUsuario(uid, dados) {

    try {

        await setDoc(doc(db, "usuarios", uid), dados);

        console.log("Usuário salvo no Firestore!");

    } catch (erro) {

        console.error(
            "Erro ao salvar usuário:",
            erro
        );

        throw erro;
    }
}

export { db };