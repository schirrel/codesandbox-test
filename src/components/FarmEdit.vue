<template>
  <v-dialog v-model="dialog" width="500px" :fullscreen="$vuetify.breakpoint.xsOnly">
    <v-card :tile="$vuetify.breakpoint.xsOnly" class="d-flex flex-column">
      <v-card-title class="success white--text">
        <span class="headline">Editar Fazenda</span>
        <v-spacer />
        <v-btn icon color="white" @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-6">
        <v-text-field outlined label="Nome da Fazenda" v-model="farm.name" :counter="15" />
        <v-autocomplete
          outlined
          :items="states"
          @change="farm.city = null"
          v-model="farm.state"
          :filter="filterStates"
          :item-text="(f) => {
            return f.name + ' (' + f.uf + ')'
          }"
          item-value="uf"
          label="Estado"
          append-icon="mdi-map"
          hide-no-data
        />
        <v-autocomplete
          outlined
          :items="cities"
          v-model="farm.city"
          return-object
          :filter="filterCities"
          label="Cidade"
          append-icon="mdi-map-marker"
          hide-no-data
        />
      </v-card-text>
      <v-spacer />
      <v-card-actions>
        <v-btn
          text
          color="error"
          @click="remove = !remove"
        >
          <v-icon class="mr-1">
            {{ remove ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
          Apagar
        </v-btn>
        <v-spacer />
        <v-btn
          color="success"
          @click="save()"
          large
          :loading="saving"
        >
          <v-icon class="mr-1">
            mdi-check
          </v-icon>
          Salvar
        </v-btn>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="remove">
          <v-divider />
          <v-card-text>
            <strong>Atenção!</strong> Para apagar uma fazenda simplesmente remova todas as simulações vinculadas.
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </v-dialog>
</template>

<script>
import brazil from '@/assets/brazil.json'

export default {
  data: () => ({
    dialog: false,
    original: {},
    farm: {},
    states: [],
    remove: false,
    saving: false
  }),
  beforeMount () {
    this.farm.name = this.farm.city = this.farm.state = ''

    this.states = brazil.states.map(function (e) {
      return { name: e.name, uf: e.uf }
    })
  },
  methods: {
    open (original) {
      if (!original || !original.code) {
        this.$emit('message', 'Impossível abrir esta fazenda!', 'error')

        return
      }

      this.original = original

      this.farm = this.lodash.cloneDeep(original)

      this.remove = false
      this.saving = false

      this.dialog = true
    },
    filterStates (item, query, text) {
      if (!item || this.lodash.isEmpty(item)) return false

      const textOne = item.name.toLowerCase()
      const textTwo = item.uf.toLowerCase()
      const search = query.toLowerCase()

      return textOne.indexOf(search) > -1 || textTwo.indexOf(search) > -1
    },
    filterCities (item, query, text) {
      if (!item || this.lodash.isEmpty(item)) return false

      const textOne = item.toLowerCase()
      const search = query.toLowerCase()

      return textOne.indexOf(search) > -1
    },
    save () {
      this.saving = true

      this.farm.changed = new Date()

      this.$db.farm
        .where('code')
        .equals(this.farm.code)
        .modify(this.farm)
        .then(() => {
          this.$emit('refresh')

          this.$emit('message', 'Fazenda alterada com sucesso!')

          this.dialog = false
        })
    }
  },
  computed: {
    cities: function () {
      if (!this.farm.state) return []

      for (let i = 0; i < brazil.states.length; i++) {
        if (brazil.states[i].uf === this.farm.state) {
          return brazil.states[i].cities
        }
      }

      return []
    }
  }
}
</script>
