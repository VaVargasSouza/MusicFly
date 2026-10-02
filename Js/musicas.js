
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import { db } from "./database.js";

// Cadastrar música
export async function cadastrarMusica(dados) {
    const musica = {
        titulo: dados.titulo,
        artista: dados.artista,
        audioUrl: dados.audioUrl,
        criadoEm: serverTimestamp()
    };

    const resultado = await addDoc(
        collection(db, "musicas"),
        musica
    );

    return resultado.id;
}

// Listar músicas
export async function listarMusicas() {
    const consulta = query(
        collection(db, "musicas"),
        orderBy("criadoEm", "desc")
    );

    const resultado = await getDocs(consulta);

    return resultado.docs.map(documento => ({
        id: documento.id,
        ...documento.data()
    }));
}

// Editar música
export async function editarMusica(id, dados) {
    const referencia = doc(db, "musicas", id);

    await updateDoc(referencia, {
        titulo: dados.titulo,
        artista: dados.artista,
        audioUrl: dados.audioUrl
    });
}

// Excluir música
export async function excluirMusica(id) {
    const referencia = doc(db, "musicas", id);

    await deleteDoc(referencia);
}