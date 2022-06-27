<template>
  <v-card :tile="$vuetify.breakpoint.xsOnly" class="d-flex flex-column">
    <v-card-title
      :class="!accept ? 'error white--text' : 'success white--text'"
    >
      <span class="headline">{{ accept ? 'Criar Simulação' : 'Atenção!' }}</span>
      <v-spacer />
      <v-btn icon class="hidden-sm-and-up" color="white" @click="cancel()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card-text class="pt-4 pb-0 subtitle-1">
          Esta ferramenta permitirá simular...
        </v-card-text>
        <v-card-text class="pt-4 pb-0 subtitle-1 font-weight-bold">
          Assim, para garantir a acurácia dos dados de entrada, é altamente
          recomendável que eles sejam coletados a campo por um técnico
          capacitado.
        </v-card-text>
        <v-card-actions class="py-0 px-6">
          <v-switch
            v-model="accept"
            label="Estou ciente e quero continuar."
            @change="() => {
              if (!accept)
                reload()
            }"
          />
        </v-card-actions>
        <v-container class="px-6 pt-0 pb-0" v-show="accept">
          <v-autocomplete
            outlined
            :items="farms"
            v-model="farm"
            return-object
            :filter="filterFarms"
            :item-text="(f) => {
              if (!f.code) return f.description

              return f.name + ' (' + f.city + ' - ' + f.state + ')'
            }"
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
        </v-container>
        <v-divider v-if="showNewFarm" />
        <v-container class="mt-0" v-if="showNewFarm">
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
      </v-window-item>
      <v-window-item :value="2">
        <v-card outlined color="white">
          <v-card-text>
            <v-text-field
              outlined
              v-model="newSimulation.name"
              label="Nome da Simulação"
              :counter="15"
            />

            <v-text-field
              outlined
              v-model.number="newSimulation.area"
              label="Tamanho da Área"
              hint="Área a ser certificada (em hectares)."
              suffix="ha"
              type="number"
            />
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
    <v-spacer />
    <v-card-actions v-if="step === 1">
      <v-btn
        color="error"
        text
        @click="cancel()"
        v-if="!$vuetify.breakpoint.xsOnly"
      >
        Cancelar
      </v-btn>

      <v-spacer v-if="!$vuetify.breakpoint.xsOnly" />

      <v-btn
        color="primary white--text"
        depressed
        :disabled="!validateStep1()"
        large
        :block="$vuetify.breakpoint.xsOnly"
        @click="step++"
      >
        Próximo
        <v-icon class="ml-1">
          mdi-arrow-right
        </v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-actions v-if="step === 2 && !$vuetify.breakpoint.xsOnly">
      <v-btn
        color="error"
        text
        @click="cancel()"
      >
        Cancelar
      </v-btn>

      <v-spacer />

      <v-btn
        color="warning"
        @click="step--"
        text
      >
        <v-icon>mdi-arrow-left</v-icon>
        Voltar
      </v-btn>

      <v-btn
        color="success white--text"
        depressed
        :disabled="!validateStep2()"
        x-large
        @click="save()"
        :loading="saving"
      >
        <v-icon class="mr-1">
          mdi-leaf
        </v-icon>
        Iniciar Simulação
      </v-btn>
    </v-card-actions>
    <v-card-actions v-if="step === 2 && $vuetify.breakpoint.xsOnly">
      <v-row wrap>
        <v-col cols="12">
          <v-btn
            color="success white--text"
            depressed
            :disabled="!validateStep2()"
            x-large
            @click="save()"
            block
            :loading="saving"
          >
            <v-icon class="mr-1">
              mdi-leaf
            </v-icon>
            Iniciar Simulação
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn
            color="warning"
            @click="step--"
            text
            block
          >
            <v-icon>mdi-arrow-left</v-icon>
            Voltar
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import brazil from '@/assets/brazil.json'

import { v4 as uuid } from 'uuid'

export default {
  data: () => ({
    accept: false,
    step: 1,
    farm: null,
    farms: [],
    showNewFarm: false,
    newFarm: {
      name: '',
      city: null,
      state: null
    },
    newSimulation: {
      name: '',
      area: 0
    },
    saving: false,
    beta: false,
    states: []
  }),
  beforeMount () {
    this.beta = this.$localStorage.get('beta')

    this.states = brazil.states.map(function (e) {
      return { name: e.name, uf: e.uf }
    })

    this.loadFarms()
  },
  methods: {
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
      this.step = 1
      this.accept = false
      this.saving = false

      this.farm = null
      this.newFarm.name = ''
      this.newFarm.city = this.newFarm.state = null
      this.showNewFarm = false

      this.newSimulation.name = ''
      this.newSimulation.area = 0
    },
    cancel () {
      this.reload()

      this.$emit('close')
    },
    validateStep1 () {
      return (this.farm && this.farm.code) || (this.newFarm.name.length > 0 && this.newFarm.name.length <= 15 && this.newFarm.city && this.newFarm.state)
    },
    validateStep2 () {
      return (
        this.newSimulation.name.length > 0 &&
        this.newSimulation.name.length <= 15 &&
        this.newSimulation.area > 0
      )
    },
    showNewFarmForm () {
      if (this.farm.code) {
        this.newFarm.name = ''

        this.newFarm.city = this.newFarm.state = null

        this.showNewFarm = false
      } else {
        this.showNewFarm = true
      }
    },
    save () {
      this.saving = true

      if (!this.farm.code) this.saveFarm()
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
        this.farm.code = f.code

        this.saveSimulation()
      })
    },
    saveSimulation () {
      const s = {
        code: uuid(),
        name: this.newSimulation.name,
        area: this.newSimulation.area,
        farm: this.farm.code,
        created: new Date(),
        changed: new Date(),
        active: true
      }

      this.$db.simulation.add(s).then(() => {
        this.loadFarms()

        this.$emit('refresh')

        this.$emit('close')

        this.reload()

        this.$router.push({
          path: '/simulation/' + s.code
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
