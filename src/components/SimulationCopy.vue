<template>
  <v-dialog v-model="dialog" width="500px" :fullscreen="$vuetify.breakpoint.xsOnly" persistent>
    <v-card :tile="$vuetify.breakpoint.xsOnly" class="d-flex flex-column">
      <v-card-title class="warning white--text">
        <span class="headline">Duplicar Simulação</span>
        <v-spacer />
        <v-btn icon color="white" @click="cancel()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-6">
        <v-text-field
          outlined
          v-model="simulation.name"
          label="Nome da Simulação"
          :counter="15"
        />

        <v-text-field
          outlined
          v-model="simulation.area"
          label="Tamanho da Área"
          hint="Área a ser certificada (em hectares)."
          suffix="ha"
          type="number"
        />

        <v-autocomplete
          outlined
          :items="farms"
          v-model="simulation.farm"
          :filter="filterFarms"
          :item-text="(f) => {
            if (!f.code) return f.description

            return f.name + ' (' + f.city + ' - ' + f.state + ')'
          }"
          item-value="code"
          label="Selecione uma fazenda..."
          append-outer-icon="mdi-tractor"
          @change="showNewFarmForm()"
          hide-no-data
        >
          <template v-slot:item="{ item }">
            <template v-if="!item.code">
              <v-list-item-icon class="mr-1">
                <v-icon color="error">
                  mdi-plus-box
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content class="error--text">
                Cadastrar uma nova fazenda...
              </v-list-item-content>
            </template>
            <template v-else>
              <v-list-item-content v-if="item.code">
                <v-list-item-title class="primary--text" v-text="item.name" />
                <v-list-item-subtitle v-text="item.city + ' - ' + item.state" />
              </v-list-item-content>
            </template>
          </template>
        </v-autocomplete>
        <v-divider v-if="showNewFarm" />
        <v-container class="mt-0 px-0" v-if="showNewFarm">
          <v-card outlined color="blue-grey lighten-5">
            <v-card-title>Cadastrar Fazenda</v-card-title>
            <v-card-text>
              <v-text-field outlined label="Nome da Fazenda" v-model="newFarm.name" :counter="15" />

              <v-autocomplete
                outlined
                :items="states"
                @change="newFarm.city = null"
                v-model="newFarm.state"
                return-object
                :filter="filterStates"
                item-text="name"
                label="Estado"
                append-icon="mdi-map"
                hide-no-data
              />

              <v-autocomplete
                outlined
                :items="cities"
                v-model="newFarm.city"
                return-object
                :filter="filterCities"
                label="Cidade"
                append-icon="mdi-map-marker"
                hide-no-data
              />
            </v-card-text>
          </v-card>
        </v-container>
      </v-card-text>
      <v-spacer />
      <v-card-actions>
        <v-spacer v-if="!$vuetify.breakpoint.xsOnly" />

        <v-btn
          color="error"
          text
          @click="cancel()"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="warning white--text"
          depressed
          :disabled="!validate()"
          large
          :block="$vuetify.breakpoint.xsOnly"
          :saving="saving"
          @click="copy()"
        >
          <v-icon class="mr-1">
            mdi-content-copy
          </v-icon>
          Duplicar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import brazil from '@/assets/brazil.json'

import { v4 as uuid } from 'uuid'

export default {
  data: () => ({
    dialog: false,
    simulation: {},
    farms: [],
    showNewFarm: false,
    newFarm: {
      name: '',
      city: null,
      state: null
    },
    saving: false,
    states: []
  }),
  beforeMount () {
    this.states = brazil.states.map(function (e) {
      return { name: e.name, uf: e.uf }
    })

    this.loadFarms()
  },
  methods: {
    open (original) {
      this.simulation = this.lodash.cloneDeep(original)

      this.simulation.name = 'Cópia ' + this.simulation.name.substr(0, 9)

      this.dialog = true
    },
    filterFarms (item, query, text) {
      if (!item || !item.code) return false

      const textOne = item.name.toLowerCase()
      const textTwo = (item.city + ' - ' + item.state).toLowerCase()
      const search = query.toLowerCase()

      return textOne.indexOf(search) > -1 || textTwo.indexOf(search) > -1
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
    loadFarms () {
      this.$db.simulation
        .orderBy('farm')
        .and(s => s.active)
        .keys(keys => {
          this.$db.farm
            .where('code')
            .anyOf(keys)
            .sortBy('name')
            .then((farms) => {
              farms.unshift({
                code: null,
                description: 'Cadastrar uma nova fazenda...'
              })

              this.farms = farms
            })
        })
    },
    reload () {
      this.saving = false

      this.newFarm.name = ''
      this.newFarm.city = this.newFarm.state = null
      this.showNewFarm = false
    },
    cancel () {
      this.reload()

      this.dialog = false
    },
    validate () {
      return (
        this.simulation && this.simulation.name &&
        this.simulation.name.length > 0 && this.simulation.name.length <= 15 && this.simulation.area > 0 &&
        (this.simulation.farm || (this.newFarm.name.length > 0 && this.newFarm.name.length <= 15 && this.newFarm.city && this.newFarm.state))
      )
    },
    showNewFarmForm () {
      if (this.simulation.farm) {
        this.newFarm.name = ''

        this.newFarm.city = this.newFarm.state = null

        this.showNewFarm = false
      } else {
        this.showNewFarm = true
      }
    },
    copy () {
      this.saving = true

      if (!this.simulation.farm) this.saveFarm()
      else this.saveSimulation()
    },
    saveFarm () {
      const f = {
        code: uuid(),
        name: this.newFarm.name,
        city: this.newFarm.city,
        state: this.newFarm.state.uf,
        created: new Date(),
        changed: new Date()
      }

      this.$db.farm.add(f).then(() => {
        this.loadFarms()

        this.simulation.farm = f.code

        this.saveSimulation()
      })
    },
    saveSimulation () {
      this.simulation.code = uuid()
      this.simulation.created = new Date()
      this.simulation.changed = new Date()
      this.simulation.active = true

      this.$db.simulation.add(this.simulation).then(() => {
        this.$emit('refresh')

        this.dialog = false

        this.reload()

        this.$router.push({
          path: '/simulation/' + this.simulation.code
        })
      })
    },
    number (evt) {
      if (!evt) evt = window.event

      const charCode = evt.which ? evt.which : evt.keyCode

      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) evt.preventDefault()
      else return true
    }
  },
  computed: {
    cities: function () {
      if (!this.newFarm.state) return []

      for (let i = 0; i < brazil.states.length; i++) {
        if (brazil.states[i].name === this.newFarm.state.name) {
          return brazil.states[i].cities
        }
      }

      return []
    }
  }
}
</script>
