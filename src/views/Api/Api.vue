<template>
    <v-layout row wrap>

        <v-layout row class="primary">
            <span>explorer detail</span>
        </v-layout>

    </v-layout>

</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import store from '@/store';

export default {
    name: 'api',
    components: {},
    props: {},
    data () {
        return {};
    },
    computed: {
        ...mapGetters({
        }),
        ...mapState({
        }),
        isMobile () {

            return this.$vuetify.breakpoint.smAndDown;
        }
    },
    methods: {
        ...mapActions({

        })
    }
};
</script>

<style scoped>

</style>
