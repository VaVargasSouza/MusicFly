if ("serviceWorker" in navigator) {

    window.addEventListener("load", async () => {

        try {

            const registro =
                await navigator.serviceWorker.register(
                    "./sw.js"
                );

            console.log(
                "MusicFly PWA ativado:",
                registro.scope
            );

        } catch (erro) {

            console.error(
                "Erro ao registrar o PWA:",
                erro
            );
        }

    });

}