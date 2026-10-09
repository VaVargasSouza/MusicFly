
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

const colecaoMusicas = collection(db, "musicas");

export async function cadastrarMusica(dados) {
    const musica = {
        titulo: dados.titulo.trim(),
        artista: dados.artista.trim(),
        audioUrl: dados.audioUrl.trim(),
        capaUrl: dados.capaUrl?.trim() || "",
        criadoEm: serverTimestamp()
    };

    const resultado = await addDoc(
        colecaoMusicas,
        musica
    );

    return resultado.id;
}

export async function listarMusicas() {
    const consulta = query(
        colecaoMusicas,
        orderBy("criadoEm", "desc")
    );

    const resultado = await getDocs(consulta);

    return resultado.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    }));
}

export async function editarMusica(id, dados) {
    await updateDoc(doc(db, "musicas", id), {
        titulo: dados.titulo.trim(),
        artista: dados.artista.trim(),
        audioUrl: dados.audioUrl.trim(),
        capaUrl: dados.capaUrl?.trim() || ""
    });
}

export async function excluirMusica(id) {
    await deleteDoc(doc(db, "musicas", id));
}