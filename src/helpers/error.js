export default {
  methods: {
    errorMessage (error) {
      let message =
        'O servidor remoto parece estar indisponível! Por favor, tente novamente mais tarde.'

      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.code !== undefined
      ) {
        switch (error.response.data.code) {
          case 'EMAIL_EMPTY_OR_INVALID':
            message =
              'O e-mail inserido é inválido! Por favor, verifique se está escrito corretamente.'
            break

          case 'PIN_EMPTY_OR_INVALID':
            message =
              'O PIN inserido é inválido! Por favor, verifique se você digitou corretamente.'
            break

          case 'IMPOSSIBLE_TO_CHECK_PIN':
            message =
              'Não foi possível checar o PIN armazenado em nuvem! Por favor, avise a equipe de suporte.'
            break

          case 'INCORRECT_PIN':
            message =
              'O PIN inserido não foi encontrado! Por favor, verifique se inseriu corretamente ou clique em CANCELAR e refaça o processo.'
            break

          case 'EXPIRED_PIN':
            message =
              'O PIN inserido está expirado! Por favor, clique em CANCELAR e refaça o processo para obter um PIN válido.'
            break

          case 'IMPOSSIBLE_TO_GET_USER':
            message =
              'Não foi possível obter os dados armazenados em nuvem do usuário! Por favor, avise a equipe de suporte.'
            break

          case 'IMPOSSIBLE_TO_SAVE_USER':
            message =
              'Não foi possível armazenar os dados em nuvem! Por favor, avise a equipe de suporte.'
            break

          case 'SMTP_SERVER_UNREACHABLE':
            message =
              'O servidor de envio de e-mails está indisponível! Por favor, tente novamente mais tarde.'
            break

          case 'IMPOSSIBLE_TO_SAVE_PIN':
            message =
              'Não foi possível armazenar os dados em nuvem! Por favor, avise a equipe de suporte.'
            break

          case 'ERROR_TO_SEND_MAIL':
            message =
              'Não foi possível enviar o e-mail com o PIN! Por favor, tente novamente mais tarde.'
            break

          case 'IMPOSSIBLE_TO_DELETE_SIMULATIONS':
            message =
              'Não foi possível apagar as suas simulações! Por favor, avise a equipe de suporte.'
            break

          case 'IMPOSSIBLE_TO_DELETE_FARMS':
            message =
              'Não foi possível apagar as fazendas vinculadas à sua conta! Por favor, avise a equipe de suporte.'
            break

          case 'IMPOSSIBLE_TO_DELETE_USER':
            message =
              'Não foi possível apagar a sua conta de usuário! Por favor, avise a equipe de suporte.'
            break

          case 'NAME_NOT_SEND':
            message = 'Houve um erro no envio do nome!'
            break

          case 'IMPOSSIBLE_TO_CHANGE_NAME':
            message =
              'Não foi possível alterar o seu nome de usuário! Por favor, avise a equipe de suporte.'
            break

          default:
            message += ' [' + error.response.data.code + ']'
        }
      } else {
        console.log(error)
      }

      return message
    }
  },
  enums: {
    oldJson: 'JSON modelo antigo ignorando simulationData',
    cannotRemoveDefault: 'Não é possível excluir os dois primeiros vértices.',
    cannotRemoveLastChild:
      'Não é possível excluir o último filho de mesmo tipo enquanto houver outro de tipo oposto.',
    cannotRemoveIfHaveChildrens: 'Não é possível excluir vértice com filhos.',
    cannotInclude: 'Não é possível adicionar vértice na raiz.',
    mustIsEqualFather:
      'O primeiro filho adicionado deve ser de mesmo tipo do pai.',
    cannotHaveChildren: 'Primeiro nó balanço não pode ter filhos.',
    mustHaveChildren:
      'Não é possível adicionar balanço se o segundo vértice não tiver filhos.',
    mustStartwithChildren: 'Balanço misto deve ter dois vértices não terminais.',
    cannotStartBalanceWithBalance:
      'O balanço deve sempre começar de um nó não balanço.',
    cannotRemoveFatherBalanceBigger2:
      'Não pode remover nó pai de um balanço composto por mais de 2 nós.',
    cannotAddBalanceInDefaultNodes:
      'Não é possível adicionar balanço aos dois primeiros vértices.',
    cannotHaveBalanceWithDifferentRessources:
      'Não é possível adicionar balanço com recursos diferentes.',
    mustRemoveBalanceBefore:
      'Não é possível excluir vértice associado a balanço.',
    cannotCreateBalanceIfIsAlready:
      'Não é possível adicionar um vértice que já pertence ao balanço.',
    firstClickCannotBeBalance:
      'Balanço misto deve ter dois vértices não terminais de tipos opostos.',
    isNotBalance: 'Não é possível excluir balanço de vértice que não é balanço.',
    cannotAddNodeInBalanceChildren:
      'Não é possível adicionar vértice a terminal de balanço.',
    cannotCreateMixBalanceWithFatherWithMore2Childrens:
      'Balanço misto não pode ter vértice com dois ou mais filhos.',
    cannotAddTerminal: 'Não pode adicionar se o nó não for terminal',
    cannotClickedTwoNonTerminal: 'Balanço não pode ser feito em dois nós terminais.',
    cannotAddBalanceBetweenParentAndChildren:
      'Não é possível adicionar balanço entre pai e filho.'
  }
}
