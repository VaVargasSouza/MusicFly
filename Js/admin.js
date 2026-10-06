import {
    auth,
    observarUsuario,
    fazerLogout
} from "./auth.js";

import { db } from "./database.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import {
    cadastrarMusica,
    listarMusicas,
    editarMusica,
    excluirMusica
} from "./musicas.js";


const form = document.getElementById("formMusica");
const lista = document.getElementById("listaMusicas");
const mensagem = document.getElementById("mensagem");
const emailAdmin = document.getElementById("emailAdmin");
const tituloFormulario = document.getElementById("tituloFormulario");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");
const btnSair = document.getElementById("btnSair");
const btnMusica = document.getElementById("btnMusica");


let idEdicao = null;
let carregando = false;


// ========================================
// MENSAGEM
// ========================================

function mostrarMensagem(texto) {
    mensagem.textContent = texto;
}


// ========================================
// PEGAR DADOS DO FORMULÁRIO
// ========================================

function obterDadosFormulario() {
    return {
        titulo:
            document.getElementById("titulo").value.trim(),

        artista:
            document.getElementById("artista").value.trim(),

        audioUrl:
            document.getElementById("audioUrl").value.trim()
    };
}


// ========================================
// LIMPAR FORMULÁRIO
// ========================================

function limparFormulario() {

    form.reset();

    idEdicao = null;

    tituloFormulario.textContent =
        "Cadastrar música";

    btnSalvar.textContent =
        "Cadastrar música";

    btnCancelar.hidden = true;
}


// ========================================
// CRIAR ELEMENTO
// ========================================

function criarTexto(tag, texto) {

    const elemento =
        document.createElement(tag);

    elemento.textContent =
        texto || "";

    return elemento;
}


// ========================================
// CARREGAR MÚSICAS
// ========================================

async function carregarMusicas() {

    lista.replaceChildren(
        criarTexto(
            "p",
            "Carregando músicas..."
        )
    );

    try {

        const musicas =
            await listarMusicas();

        lista.replaceChildren();

        if (musicas.length === 0) {

            lista.append(
                criarTexto(
                    "p",
                    "Nenhuma música cadastrada."
                )
            );

            return;
        }


        musicas.forEach(musica => {

            const card =
                document.createElement("article");

            card.className =
                "musica-admin";


            const informacoes =
                document.createElement("div");

            informacoes.className =
                "musica-admin-info";


            informacoes.append(

                criarTexto(
                    "h4",
                    musica.titulo
                ),

                criarTexto(
                    "p",
                    musica.artista
                )

            );


            const botoes =
                document.createElement("div");

            botoes.className =
                "admin-buttons";


            // ========================================
            // BOTÃO EDITAR
            // ========================================

            const editar =
                criarTexto(
                    "button",
                    "Editar"
                );

            editar.type = "button";


            editar.addEventListener(
                "click",
                () => {

                    document.getElementById(
                        "titulo"
                    ).value =
                        musica.titulo || "";


                    document.getElementById(
                        "artista"
                    ).value =
                        musica.artista || "";


                    document.getElementById(
                        "audioUrl"
                    ).value =
                        musica.audioUrl || "";


                    idEdicao =
                        musica.id;


                    tituloFormulario.textContent =
                        "Editar música";


                    btnSalvar.textContent =
                        "Salvar alterações";


                    btnCancelar.hidden =
                        false;


                    form.scrollIntoView({
                        behavior: "smooth"
                    });

                }
            );


            // ========================================
            // BOTÃO EXCLUIR
            // ========================================

            const excluir =
                criarTexto(
                    "button",
                    "Excluir"
                );

            excluir.type = "button";


            excluir.addEventListener(
                "click",
                async () => {

                    if (
                        !confirm(
                            `Deseja excluir "${musica.titulo}"?`
                        )
                    ) {
                        return;
                    }


                    excluir.disabled =
                        true;


                    try {

                        await excluirMusica(
                            musica.id
                        );


                        mostrarMensagem(
                            "Música excluída com sucesso!"
                        );


                        await carregarMusicas();


                    } catch (erro) {

                        console.error(
                            erro
                        );


                        mostrarMensagem(
                            "Não foi possível excluir a música."
                        );


                        excluir.disabled =
                            false;
                    }

                }
            );


            botoes.append(
                editar,
                excluir
            );


            card.append(
                informacoes,
                botoes
            );


            lista.append(
                card
            );

        });


    } catch (erro) {

        console.error(
            "Erro ao carregar músicas:",
            erro
        );


        lista.replaceChildren(

            criarTexto(
                "p",
                "Erro ao carregar músicas. Verifique a conexão e as regras do Firestore."
            )

        );

    }
}


// ========================================
// CADASTRAR / EDITAR MÚSICA
// ========================================

form.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        if (carregando) {
            return;
        }


        const dados =
            obterDadosFormulario();


        if (
            Object.values(dados)
                .some(valor => !valor)
        ) {

            mostrarMensagem(
                "Preencha todos os campos."
            );

            return;
        }


        carregando =
            true;


        btnSalvar.disabled =
            true;


        try {

            if (idEdicao) {

                await editarMusica(
                    idEdicao,
                    dados
                );


                mostrarMensagem(
                    "Música atualizada com sucesso!"
                );

            } else {

                await cadastrarMusica(
                    dados
                );


                mostrarMensagem(
                    "Música cadastrada com sucesso!"
                );

            }


            limparFormulario();

            await carregarMusicas();


        } catch (erro) {

            console.error(
                "Erro ao salvar música:",
                erro
            );


            mostrarMensagem(
                "Não foi possível salvar. Verifique suas permissões no Firebase."
            );


        } finally {

            carregando =
                false;


            btnSalvar.disabled =
                false;

        }

    }
);


// ========================================
// CANCELAR EDIÇÃO
// ========================================

btnCancelar.addEventListener(
    "click",
    () => {

        limparFormulario();

        mostrarMensagem("");

    }
);


// ========================================
// SAIR DA CONTA
// ========================================

btnSair.addEventListener(
    "click",
    async () => {

        btnSair.disabled =
            true;


        try {

            await fazerLogout();


            window.location.replace(
                "./usuario.html"
            );


        } catch (erro) {

            console.error(
                erro
            );


            mostrarMensagem(
                "Não foi possível sair da conta."
            );


            btnSair.disabled =
                false;

        }

    }
);


// ========================================
// IR PARA MUSICFLY
// ========================================

btnMusica.addEventListener(
    "click",
    () => {

        window.location.href =
            "./main.html";

    }
);


// ========================================
// VERIFICAR LOGIN E ADMIN
// ========================================

let usuarioVerificado =
    null;

let verificacao =
    0;


observarUsuario(
    async (usuario) => {

        const tentativa =
            ++verificacao;


        usuarioVerificado =
            usuario;


        // ----------------------------------------
        // NÃO ESTÁ LOGADO
        // ----------------------------------------

        if (!usuario) {

            window.location.replace(
                "./usuario.html"
            );

            return;
        }


        try {

            const referencia =
                doc(
                    db,
                    "usuarios",
                    usuario.uid
                );


            const perfil =
                await getDoc(
                    referencia
                );


            if (
                tentativa !==
                verificacao
            ) {
                return;
            }


            // ----------------------------------------
            // NÃO É ADMIN
            // ----------------------------------------

            if (
                !perfil.exists() ||
                perfil.data().tipo !== "admin"
            ) {

                alert(
                    "Você não tem permissão para acessar o painel administrativo."
                );


                window.location.replace(
                    "./main.html"
                );


                return;
            }


            // ----------------------------------------
            // ADMINISTRADOR CONFIRMADO
            // ----------------------------------------

            emailAdmin.textContent =
                usuario.email || "";


            await carregarMusicas();


        } catch (erro) {

            if (
                tentativa !==
                verificacao
            ) {
                return;
            }


            console.error(
                "Erro ao verificar administrador:",
                erro
            );


            alert(
                "Não foi possível verificar suas permissões."
            );


            window.location.replace(
                "./main.html"
            );

        }

    }
);