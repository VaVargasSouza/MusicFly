import {
    observarUsuario,
    fazerLogout
} from "./auth.js";

import {
    cadastrarMusica,
    listarMusicas,
    editarMusica,
    excluirMusica
} from "./musicas.js";


// ========================================
// UID DO ADMINISTRADOR
// ========================================

const UID_ADMIN =
    "QjjdnmbhsbVkN57Y8gRZw1c154y1";


// ========================================
// ELEMENTOS
// ========================================

const emailAdmin =
    document.getElementById("emailAdmin");

const btnMusica =
    document.getElementById("btnMusica");

const btnSair =
    document.getElementById("btnSair");

const formMusica =
    document.getElementById("formMusica");

const tituloFormulario =
    document.getElementById("tituloFormulario");

const titulo =
    document.getElementById("titulo");

const artista =
    document.getElementById("artista");

const audioUrl =
    document.getElementById("audioUrl");

const btnSalvar =
    document.getElementById("btnSalvar");

const btnCancelar =
    document.getElementById("btnCancelar");

const mensagem =
    document.getElementById("mensagem");

const listaMusicas =
    document.getElementById("listaMusicas");


// ========================================
// ESTADO
// ========================================

let usuarioAtual = null;

let ehAdmin = false;

let idEdicao = null;


// ========================================
// VERIFICAR USUÁRIO
// ========================================

observarUsuario(
    async (usuario) => {

        if (!usuario) {

            window.location.replace(
                "./usuario.html"
            );

            return;
        }


        usuarioAtual = usuario;


        emailAdmin.textContent =
            usuario.email || "";


        // ========================================
        // VERIFICA ADMIN PELO UID
        // ========================================

        ehAdmin =
            usuario.uid === UID_ADMIN;


        console.log(
            "UID:",
            usuario.uid
        );

        console.log(
            "É administrador:",
            ehAdmin
        );


        // ========================================
        // NÃO É ADMIN
        // ========================================

        if (!ehAdmin) {

            alert(
                "Acesso permitido somente para o administrador."
            );


            window.location.replace(
                "./main.html"
            );


            return;
        }


        // ========================================
        // É ADMIN
        // ========================================

        await carregarMusicas();
    }
);


// ========================================
// CARREGAR MÚSICAS
// ========================================

async function carregarMusicas() {

    mensagem.textContent =
        "Carregando músicas...";


    listaMusicas.replaceChildren();


    try {

        const musicas =
            await listarMusicas();


        if (
            musicas.length === 0
        ) {

            mensagem.textContent =
                "Ainda não há músicas cadastradas.";

            return;
        }


        mensagem.textContent = "";


        musicas.forEach(
            (musica) => {

                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "musica-admin";


                const informacoes =
                    document.createElement(
                        "div"
                    );

                informacoes.className =
                    "musica-info-admin";


                const tituloMusica =
                    document.createElement(
                        "h4"
                    );

                tituloMusica.textContent =
                    musica.titulo || "";


                const artistaMusica =
                    document.createElement(
                        "p"
                    );

                artistaMusica.textContent =
                    musica.artista || "";


                const botoes =
                    document.createElement(
                        "div"
                    );

                botoes.className =
                    "musica-acoes";


                // ========================================
                // BOTÃO EDITAR
                // ========================================

                const btnEditar =
                    document.createElement(
                        "button"
                    );

                btnEditar.type =
                    "button";

                btnEditar.textContent =
                    "Editar";


                btnEditar.addEventListener(
                    "click",
                    () => {

                        if (!ehAdmin) {
                            return;
                        }


                        idEdicao =
                            musica.id;


                        titulo.value =
                            musica.titulo || "";


                        artista.value =
                            musica.artista || "";


                        audioUrl.value =
                            musica.audioUrl || "";


                        tituloFormulario.textContent =
                            "Editar música";


                        btnSalvar.textContent =
                            "Salvar alterações";


                        btnCancelar.hidden =
                            false;


                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });
                    }
                );


                // ========================================
                // BOTÃO EXCLUIR
                // ========================================

                const btnExcluir =
                    document.createElement(
                        "button"
                    );

                btnExcluir.type =
                    "button";

                btnExcluir.textContent =
                    "Excluir";


                btnExcluir.addEventListener(
                    "click",
                    async () => {

                        if (!ehAdmin) {
                            return;
                        }


                        const confirmar =
                            confirm(
                                `Deseja excluir "${musica.titulo}"?`
                            );


                        if (!confirmar) {
                            return;
                        }


                        try {

                            await excluirMusica(
                                musica.id
                            );


                            mensagem.textContent =
                                "Música excluída com sucesso.";


                            await carregarMusicas();


                        } catch (erro) {

                            console.error(
                                "Erro ao excluir música:",
                                erro
                            );


                            mensagem.textContent =
                                "Não foi possível excluir a música.";
                        }
                    }
                );


                informacoes.append(
                    tituloMusica,
                    artistaMusica
                );


                botoes.append(
                    btnEditar,
                    btnExcluir
                );


                card.append(
                    informacoes,
                    botoes
                );


                listaMusicas.append(
                    card
                );
            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar músicas:",
            erro
        );


        mensagem.textContent =
            "Não foi possível carregar as músicas.";
    }
}


// ========================================
// SALVAR MÚSICA
// ========================================

formMusica.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        // ========================================
        // SEGURANÇA
        // ========================================

        if (!ehAdmin) {

            mensagem.textContent =
                "Somente o administrador pode alterar músicas.";

            return;
        }


        const dados = {

            titulo:
                titulo.value.trim(),

            artista:
                artista.value.trim(),

            audioUrl:
                audioUrl.value.trim()
        };


        if (
            !dados.titulo ||
            !dados.artista ||
            !dados.audioUrl
        ) {

            mensagem.textContent =
                "Preencha todos os campos.";

            return;
        }


        try {

            btnSalvar.disabled =
                true;


            // ========================================
            // EDITAR
            // ========================================

            if (idEdicao) {

                await editarMusica(
                    idEdicao,
                    dados
                );


                mensagem.textContent =
                    "Música editada com sucesso.";


            } else {


                // ========================================
                // CADASTRAR
                // ========================================

                await cadastrarMusica(
                    dados
                );


                mensagem.textContent =
                    "Música cadastrada com sucesso.";
            }


            formMusica.reset();


            idEdicao =
                null;


            tituloFormulario.textContent =
                "Cadastrar música";


            btnSalvar.textContent =
                "Cadastrar música";


            btnCancelar.hidden =
                true;


            await carregarMusicas();


        } catch (erro) {

            console.error(
                "Erro ao salvar música:",
                erro
            );


            mensagem.textContent =
                "Não foi possível salvar a música.";
        }


        finally {

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

        idEdicao =
            null;


        formMusica.reset();


        tituloFormulario.textContent =
            "Cadastrar música";


        btnSalvar.textContent =
            "Cadastrar música";


        btnCancelar.hidden =
            true;


        mensagem.textContent = "";
    }
);


// ========================================
// IR PARA MUSICFLY
// ========================================

btnMusica.addEventListener(
    "click",
    () => {

        window.location.replace(
            "./main.html"
        );
    }
);


// ========================================
// SAIR
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
                "Erro ao sair:",
                erro
            );


            mensagem.textContent =
                "Não foi possível sair da conta.";


            btnSair.disabled =
                false;
        }
    }
);