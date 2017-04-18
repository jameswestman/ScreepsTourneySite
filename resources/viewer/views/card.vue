<template>
    <div class="mdc-card">
        <section class="mdc-card__primary">
            <h1 class="mdc-card__title mdc-card__title--large">{{structure.structureType}}</h1>
            <h2 class="mdc-card__subtitle">{{structure.id}}</h2>
        </section>
        <section class="mdc-card__supporting-text">
        </section>
    </div>
</template>

<script>
export default {
    props: ["structure"]
}
</script>
