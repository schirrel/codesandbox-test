<template>
  <div id="vue-ribbon-box" class="text-xs-center">
    <a
      :id="componentId"
      :title="text"
      :class="ribbonClass"
      :data-ribbon="text"
      @click="dialog = !dialog"
      v-if="type === 'ribbon'"
    >{{ text }}</a>

    <v-btn
      dark
      color="orange darken-1"
      round
      @click="dialog = !dialog"
      v-if="type === 'button'"
    >
      <v-icon left>
        mdi-beta
      </v-icon>
      {{ text }}
    </v-btn>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline white--text orange darken-1" primary-title>
          <v-icon left dark large>
            mdi-alert-decagram
          </v-icon>
          Beta Release
        </v-card-title>
        <v-card-text class="pb-0 pt-4" style="text-align: justify;">
          <p>
            A funcionalidade de "sincronia em nuvem dos dados" está em estágio de <em>Beta Test</em>, ou seja, trata-se de um <strong>protótipo funcional</strong> ou
            <strong>mínimo produto viável</strong> (do inglês, <em>Minimum Viable Product</em> - MVP).
          </p>
          <p>
            A disponibilização pública neste estágio de desenvolvimento objetiva possibilitar o acesso antecipado dos usuários.
            Entretanto, devido a sua maturidade atual, o funcionalidade pode eventualmente apresentar alguma instabilidade.
            <strong>Por favor, utilize-a com cautela!</strong>
          </p>
        </v-card-text>
        <v-card-actions class="pt-0 pb-4 justify-center">
          <v-btn color="primary" @click="dialog = false" large>
            <v-icon left>
              mdi-check
            </v-icon>
            Ok
          </v-btn>
        </v-card-actions>
        <v-card-text class="blue-grey lighten-4 pt-4" style="text-align: justify;">
          <p style="text-align: center;">
            <v-icon large color="white">
              mdi-lightbulb-on
            </v-icon>
          </p>
          <p class="headline" style="text-align: center;">
            O agro precisa de você!
          </p>
          <p class="my-0">
            Torne-se nosso parceiro no desenvolvimento desta e de outras tecnologias digitais para a agropecuária:
          </p>
        </v-card-text>
        <v-card-actions class="pt-0 justify-center blue-grey lighten-4">
          <v-btn
            color="success"
            @click="dialog = false"
            large
            block
            href="https://api.whatsapp.com/send?phone=556733682193"
            target="_blank"
          >
            <v-icon left>
              mdi-whatsapp
            </v-icon>
            Contacte-nos!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialog: false
    }
  },
  props: {
    text: {
      type: String,
      default: 'BETA'
    },
    type: {
      type: String,
      validator: function (value) {
        return (
          value === 'ribbon' ||
          value === 'button'
        )
      },
      default: 'ribbon'
    },
    position: {
      type: String,
      validator: function (value) {
        return (
          value === 'left-top' ||
          value === 'right-top' ||
          value === 'left-bottom' ||
          value === 'right-bottom'
        )
      },
      default: 'right-top'
    },
    fixed: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      validator: function (value) {
        return value.length === 7
      },
      default: '#FB8C00'
    }
  },
  computed: {
    ribbonClass () {
      return {
        'vue-ribbon': true,
        [`${this.position}`]: true,
        fixed: this.fixed
      }
    },
    componentId () {
      return `vue-ribbon-${this._uid}`
    }
  },
  methods: {
    isLightColor () {
      const rgb = parseInt(this.color.substring(1), 16)
      const r = (rgb >> 16) & 0xff
      const g = (rgb >> 8) & 0xff
      const b = (rgb >> 0) & 0xff
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      return luma > 155
    },
    dynamicCSSClass () {
      const nodeId = 'vue-ribbon-bkg-' + this._uid
      let style = document.getElementById(nodeId)
      if (!style) {
        style = document.createElement('style')
        style.id = nodeId
        style.type = 'text/css'
        this.$el.appendChild(style)
      }
      let cssClass = `#${this.componentId}:before { background-color: ${
        this.color
      }} `
      if (this.isLightColor()) {
        cssClass += `#${
          this.componentId
        }:after { color: #000; border-color: #000;}`
      }
      style.innerHTML = cssClass
    }
  },
  mounted: function () {
    this.dynamicCSSClass()
  },
  beforeUpdate: function () {
    this.dynamicCSSClass()
  }
}
</script>

<style scoped>
/* Credits go to:
 * https://github.com/simonwhitaker/github-fork-ribbon-css
 */

.vue-ribbon {
  width: 12.1em;
  height: 12.1em;
  position: absolute;
  overflow: hidden;
  top: 0;
  right: 0;
  z-index: 9999;
  pointer-events: none;
  font-size: 13px;
  text-decoration: none;
  text-indent: -999999px;
}
.vue-ribbon.fixed {
  position: fixed;
}
.vue-ribbon:hover,
.vue-ribbon:active {
  background-color: rgba(0, 0, 0, 0);
}
.vue-ribbon:before,
.vue-ribbon:after {
  position: absolute;
  display: block;
  /* width: 15.38em; */
  width: 10.8em;
  height: 1.54em;
  /* top: 3.23em; */
  top: 0.9em;
  right: -3.23em;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}
.vue-ribbon:before {
  content: "";
  padding: 0.38em 0;
  background-image: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(rgba(0, 0, 0, 0)),
    to(rgba(0, 0, 0, 0.15))
  );
  background-image: -webkit-linear-gradient(
    top,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.15)
  );
  background-image: -moz-linear-gradient(
    top,
    rgba(92, 60, 60, 0),
    rgba(0, 0, 0, 0.15)
  );
  background-image: -ms-linear-gradient(
    top,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.15)
  );
  background-image: -o-linear-gradient(
    top,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.15)
  );
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.15)
  );
  -webkit-box-shadow: 0 0.15em 0.23em 0 rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0 0.15em 0.23em 0 rgba(0, 0, 0, 0.5);
  box-shadow: 0 0.15em 0.23em 0 rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}
.vue-ribbon:after {
  content: attr(data-ribbon);
  color: #fff;
  font: 700 1em "Helvetica Neue", Helvetica, Arial, sans-serif;
  line-height: 1.54em;
  text-decoration: none;
  /* text-shadow: 0 -0.08em rgba(0, 0, 0, 0.5); */
  text-align: center;
  text-indent: 0;
  padding: 0.15em 0;
  margin: 0.15em 0;
  border-width: 0.08em 0;
  border-style: dotted;
  border-color: #fff;
  border-color: rgba(255, 255, 255, 0.7);
}
.vue-ribbon.left-top,
.vue-ribbon.left-bottom {
  right: auto;
  left: 0;
}
.vue-ribbon.left-bottom,
.vue-ribbon.right-bottom {
  top: auto;
  bottom: 0;
}
.vue-ribbon.left-top:before,
.vue-ribbon.left-top:after,
.vue-ribbon.left-bottom:before,
.vue-ribbon.left-bottom:after {
  right: auto;
  left: -3.23em;
}
.vue-ribbon.left-bottom:before,
.vue-ribbon.left-bottom:after,
.vue-ribbon.right-bottom:before,
.vue-ribbon.right-bottom:after {
  top: auto;
  bottom: 3.23em;
}
.vue-ribbon.left-top:before,
.vue-ribbon.left-top:after,
.vue-ribbon.right-bottom:before,
.vue-ribbon.right-bottom:after {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
</style>
