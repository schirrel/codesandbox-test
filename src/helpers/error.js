export default {
  methods: {
    errorMessage (error) {
      let message = 'O servidor remoto parece estar indisponível! Por favor, tente novamente mais tarde.'

      if (error.response !== undefined && error.response.data !== undefined && error.response.data.code !== undefined) {
        switch (error.response.data.code) {
          case 'EMAIL_EMPTY_OR_INVALID':
            message = 'O e-mail inserido é inválido! Por favor, verifique se está escrito corretamente.'
            break

          case 'PIN_EMPTY_OR_INVALID':
            message = 'O PIN inserido é inválido! Por favor, verifique se você digitou corretamente.'
            break

          case 'IMPOSSIBLE_TO_CHECK_PIN':
            message = 'Não foi possível checar o PIN armazenado em nuvem! Por favor, avise a equipe de suporte.'
            break

          case 'INCORRECT_PIN':
            message = 'O PIN inserido não foi encontrado! Por favor, verifique se inseriu corretamente ou clique em CANCELAR e refaça o processo.'
            break

          case 'EXPIRED_PIN':
            message = 'O PIN inserido está expirado! Por favor, clique em CANCELAR e refaça o processo para obter um PIN válido.'
            break

          case 'IMPOSSIBLE_TO_GET_USER':
            message = 'Não foi possível obter os dados armazenados em nuvem do usuário! Por favor, avise a equipe de suporte.'
            break

          case 'IMPOSSIBLE_TO_SAVE_USER':
            message = 'Não foi possível armazenar os dados em nuvem! Por favor, avise a equipe de suporte.'
            break

          case 'SMTP_SERVER_UNREACHABLE':
            message = 'O servidor de envio de e-mails está indisponível! Por favor, tente novamente mais tarde.'
            break

          case 'IMPOSSIBLE_TO_SAVE_PIN':
            message = 'Não foi possível armazenar os dados em nuvem! Por favor, avise a equipe de suporte.'
            break

          case 'ERROR_TO_SEND_MAIL':
            message = 'Não foi possível enviar o e-mail com o PIN! Por favor, tente novamente mais tarde.'
            break

          case 'IMPOSSIBLE_TO_DELETE_SIMULATIONS':
            message = 'Não foi possível apagar as suas simulações! Por favor, avise a equipe de suporte.'
            break

          case 'IMPOSSIBLE_TO_DELETE_FARMS':
            message = 'Não foi possível apagar as fazendas vinculadas à sua conta! Por favor, avise a equipe de suporte.'
            break

          case 'IMPOSSIBLE_TO_DELETE_USER':
            message = 'Não foi possível apagar a sua conta de usuário! Por favor, avise a equipe de suporte.'
            break

          case 'NAME_NOT_SEND':
            message = 'Houve um erro no envio do nome!'
            break

          case 'IMPOSSIBLE_TO_CHANGE_NAME':
            message = 'Não foi possível alterar o seu nome de usuário! Por favor, avise a equipe de suporte.'
            break

          default:
            message += ' [' + error.response.data.code + ']'
        }
      } else {
        console.log(error)
      }

      return message
    }
  }
}
