
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import { db } from "./database.js";

const playlistsRef = collection(db, "playlists");

export async function criarPlaylist(uid, nome, capaUrl = "") {
    const nomeLimpo = nome.trim();

    if (!uid) throw new Error("Você precisa entrar na sua conta.");
    if (!nomeLimpo) throw new Error("Digite o nome da playlist.");

    const resultado = await addDoc(playlistsRef, {
        uid,
        nome: nomeLimpo,
        capaUrl: capaUrl.trim(),
        musicas: [],
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp()
    });

    return resultado.id;
}

export async function listarPlaylists(uid) {
    if (!uid) throw new Error("Usuário não informado.");

    const consulta = query(playlistsRef, where("uid", "==", uid));
    const resultado = await getDocs(consulta);

    return resultado.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    }));
}

export async function editarPlaylist(uid, id, nome, capaUrl = "") {
    const playlist = await obterPlaylistDoUsuario(uid, id);

    if (!playlist) {
        throw new Error("Playlist não encontrada.");
    }

    await updateDoc(doc(db, "playlists", id), {
        nome: nome.trim(),
        capaUrl: capaUrl.trim(),
        atualizadoEm: serverTimestamp()
    });
}

export async function adicionarMusicaPlaylist(uid, playlistId, musicaId) {
    const playlist = await obterPlaylistDoUsuario(uid, playlistId);

    if (!playlist) {
        throw new Error("Playlist não encontrada.");
    }

    const musicas = playlist.musicas || [];

    if (musicas.includes(musicaId)) return;

    await updateDoc(doc(db, "playlists", playlistId), {
        musicas: [...musicas, musicaId],
        atualizadoEm: serverTimestamp()
    });
}

export async function removerMusicaPlaylist(uid, playlistId, musicaId) {
    const playlist = await obterPlaylistDoUsuario(uid, playlistId);

    if (!playlist) {
        throw new Error("Playlist não encontrada.");
    }

    await updateDoc(doc(db, "playlists", playlistId), {
        musicas: (playlist.musicas || []).filter((id) => id !== musicaId),
        atualizadoEm: serverTimestamp()
    });
}

export async function excluirPlaylist(uid, id) {
    const playlist = await obterPlaylistDoUsuario(uid, id);

    if (!playlist) {
        throw new Error("Playlist não encontrada.");
    }

    await deleteDoc(doc(db, "playlists", id));
}

async function obterPlaylistDoUsuario(uid, id) {
    const consulta = query(playlistsRef, where("uid", "==", uid));
    const resultado = await getDocs(consulta);

    const documento = resultado.docs.find((item) => item.id === id);

    return documento
        ? { id: documento.id, ...documento.data() }
        : null;
}