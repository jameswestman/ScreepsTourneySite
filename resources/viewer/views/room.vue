<template>
    <div id="room">
        {{room}}
        <div class="card-column">
            <card v-for="structure in structures" v-bind:structure="structure" v-bind:key="structure.id"></card>
        </div>
    </div>
</template>

<script>
import card from "./card.vue"
export default {
    props: ["challenge", "room"],
    data() {
        return {
            selection: []
        }
    },
    components: {
        card
    }
}
</script>
