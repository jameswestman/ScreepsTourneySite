<template>
    <div id="app">
        <header class="mdc-toolbar mdc-toolbar--fixed">
            <div class="mdc-toolbar__row">
                <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
                    <span class="mdc-toolbar__title">Screeps Tournament</span>
                </section>
            </div>
        </header>

        <div class="content mdc-toolbar-fixed-adjust">
            <nav class="mdc-permanent-drawer">
                <div class="mdc-list-group">
                    <nav class="mdc-list">
                        <a class="mdc-list-item" href="#">
                            <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">assessment</i>Leaderboard
                        </a>
                        <a class="mdc-list-item" href="#">
                            <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">event</i>Events
                        </a>
                        <a class="mdc-list-item" href="#">
                            <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">info</i>Challenge Info
                        </a>
                        <a class="mdc-list-item" href="#">
                            <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">build</i>Technical Info
                        </a>
                    </nav>

                    <hr class="mdc-list-divider">

                    <nav class="mdc-list">
                        <a class="mdc-list-item" href="#">
                            <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">chat</i>Slack
                        </a>
                        <a class="mdc-list-item" href="#">
                            <img src="/github.png" class="mdc-list-item__start-detail" aria-hidden="true" />GitHub
                        </a>
                        <a class="mdc-list-item" href="#">
                            <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">home</i>Back to Homepage
                        </a>
                    </nav>
                </div>
            </nav>
            <main>
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>

<script>
export default {
}
</script>
