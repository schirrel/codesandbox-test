<template>
  <v-dialog
    @keydown.esc="cancelChangeInNode"
    content-class="rightModal"
    v-model="modalModel"
    persistent
    max-width="400px"
  >
    <v-card>
      <v-card-text>
        <v-form v-model="valid" ref="form" @submit.prevent="submit">
          <v-container>
            <v-text-field
              label="Code"
              v-model="edit.code"
              :disabled="edit.disableEdit"
              :rules="[
                rules.required,
                rules.counter,
                rules.min,
                rules.alphanumericUnderscore,
                rules.notExisists,
              ]"
            />
            <v-text-field
              label="Nome"
              v-model="edit.name"
              :disabled="edit.disableEdit"
            />
            <div>
              <label class="editor__label"> Descrição </label>
              <rich-edit
                :disabled="edit.disableEdit"
                v-model="edit.description"
                dense
              >
              </rich-edit>
            </div>
            <v-select
              :items="optionSelect.class"
              label="Classe"
              v-model="edit.class"
              required
              :disabled="edit.disableEdit"
            />
            <v-select
              :items="optionSelect.resource"
              label="Recurso"
              v-model="edit.resource"
              required
              :disabled="edit.disableEdit"
            />
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="cancelChangeInNode">Cancelar</v-btn>
        <v-btn @click="saveChangeInNode">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RichEdit from "@/components/RichEdit.vue";
export default {
  components: { RichEdit },
  props: ["modal", "optionSelect", "selectedNode"],
  data() {
    return {
      edit: {
        code: "",
        node: "",
        name: "",
        description: "",
        class: "",
        resource: "",
        disableEdit: false,
        duration: "",
        factor: "",
      },
      modalModel: false,
      selectedNodeModel: {},
      valid: false,
      rules: {
        required: (value) => !!value || "Obrigatorio.",
        counter: (value) => value.length <= 6 || "Máximo de 6 digitos",
        min: (value) => value.length > 2 || "Mínimo de 3 digitos",
        alphanumericUnderscore: (value) => {
          const pattern = /^\w+$/;
          return pattern.test(value) || "Somente números e letras.";
        },
        notExisists: (value) => {
          const currentJson = localStorage.json
            ? JSON.parse(localStorage.json)?.node?.map((node) => node.code)
            : [];
          return (
            !currentJson.some((current) => current === value) ||
            "Code existente"
          );
        },
      },
    };
  },
  watch: {
    /**
     * Observa as modificações do modal e carrega os dados do nó selecionando
     * quando o modal é aberto para edição e desabilita alguns campos caso
     * seja um nó do tipo balanço
     **/
    modal(newValue) {
      if (newValue === true) {
        this.fillChangesInputsFromNode();
        if (this.selectedNode.data.idBalance > 0) this.edit.disableEdit = true;
      } else this.edit.disableEdit = false;

      this.modalModel = newValue;
    },
    selectedNode(newValue) {
      this.selectedNodeModel = newValue;
    },
  },
  methods: {
    /**
     * Atualiza os input com os valores do nó selecionado para edição
     **/
    fillChangesInputsFromNode() {
      this.edit.code = this.selectedNode.data.code;
      this.edit.name = this.selectedNode.data.name;
      this.edit.description = this.selectedNode.data.description;
      this.edit.class = this.selectedNode.data.class;
      this.edit.resource = this.selectedNode.data.resource;
      this.edit.duration = this.selectedNode.data.duration;
      this.edit.factor = this.selectedNode.data.factor;
    },

    /**
     * Emiti um evento para o component Tree responsável por fechar o modal
     * e redesenhar a árvore em caso de cancelamento da operação
     **/
    cancelChangeInNode() {
      this.cleanChangeInputs();
      this.$emit("confirmEditNode", true);
    },

    /**
     * Limpa os dados digitados nos inputs e selects
     **/
    cleanChangeInputs() {
      this.edit.code = "";
      this.edit.name = "";
      this.edit.description = "";
      this.edit.class = "";
      this.edit.resource = "";
      this.edit.duration = "";
      this.edit.factor = "";
      this.edit.disableEdit = false;
    },

    /**
     * Atualiza o nó com os valores dos inputs e emiti um evento para o
     * component Tree responsável por fechar o modal e redesenhar a árvore
     * salvando a modificação no histórico para poder ser desfeita
     **/
    saveChangeInNode() {
      const validate = this.$refs.form.validate();
      if (validate) {
        this.saveChangesInput();
        this.cleanChangeInputs();
        this.$emit("confirmEditNode", false);
      }
    },

    /**
     * Atualiza os valores do nó com os novos valores do input
     **/
    saveChangesInput() {
      const sourceNodeCode = this.selectedNodeModel.data.code + "";

      this.selectedNodeModel.data.code = this.edit.code;
      this.selectedNodeModel.data.name = this.edit.name;
      this.selectedNodeModel.data.description = this.edit.description;
      this.selectedNodeModel.data.class = this.edit.class;
      this.selectedNodeModel.data.resource = this.edit.resource;
      this.selectedNodeModel.data.duration = this.edit.duration;
      this.selectedNodeModel.data.factor = this.edit.factor;

      // Busca o objeto recurso escolhido para pegar as propriedades
      // unit e category com base na escolha do usuário
      // const resourceName = this.edit.resource
      // const resourceData = this.optionSelect.resource.find(function (item) {
      //   return (item.text === resourceName)
      // })

      // this.selectedNodeModel.data.unit = resourceData.unit
      // this.selectedNodeModel.data.category = resourceData.category
      this.$emit("saveChangesInput", { sourceNodeCode, edited: this.edit });
    },
  },
};
</script>

<style>
@media (min-width: 600px) {
  .rightModal {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
