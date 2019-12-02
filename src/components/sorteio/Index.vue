<template>
  <div class="app-sorteio">
    <form
      @submit.prevent="listarParticipantes"
      class="meetup-event"
      v-if="!loading && !groupFound && members.length === 0"
    >
      <div class="form-group">
        <label for="groupName">Nome do grupo</label>
        <input
          id="groupName"
          type="text"
          class="form-control form-control-lg"
          v-model="groupName"
          placeholder=""
        />
      </div>

      <div class="form-group">
        <label for="meetupId">Id do meetup</label>
        <input
          id="meetupId"
          type="text"
          class="form-control form-control-lg"
          v-model="meetupId"
          placeholder=""
        />
        <small id="meetupIdHelp" class="form-text text-muted">
          Deixe em branco para listar todos membros do grupo
        </small>
      </div>
      <button
        type="submit"
        class="btn btn-secondary btn-lg btn-block"
        :disabled="groupName === ''"
      >
        Buscar
      </button>
    </form>

    <div class="loading" v-if="loading">
      <font-awesome-icon icon="sync" spin />
    </div>

    <div class="w-100 m-5 text-center" v-if="isAnError">
      <div class="alert alert-danger" role="alert">
        Grupo ou meetup não encontrado
      </div>

      <a
        href="#"
        class="btn btn-link p-5 btn-lg ml-1"
        @click.prevent="voltar()"
      >
        <font-awesome-icon icon="chevron-left" />
        Tentar novamente
      </a>
    </div>

    <template v-if="!loading && groupFound">
      <div class="alert alert-success" role="alert" v-if="!drawActive">
        <h4 class="alert-heading px-4">{{ members.length }} membros</h4>
      </div>
      <nav v-if="!drawActive">
        <a
          href="#"
          class="btn btn-link p-5 btn-lg ml-1"
          @click.prevent="voltar()"
        >
          <font-awesome-icon icon="chevron-left" />
          Voltar
        </a>
        <a
          href="#"
          class="btn btn-link p-5 btn-lg"
          @click.prevent="adicionar()"
        >
          <font-awesome-icon icon="user-plus" />
          Adicionar Nome
        </a>
        <a
          href="#"
          class="btn btn-outline p-5 btn-lg ml-1"
          @click.prevent="sortear()"
        >
          <font-awesome-icon icon="dice" />
          Sortear
        </a>
      </nav>

      <input
        type="text"
        class="input-lg mb-5"
        v-model="keyword"
        placeholder="Filtrar por nome"
        v-if="!drawActive"
      />

      <ul>
        <li v-for="(member, index) in members" :key="index">
          <div class="member-photo">
            <img :src="member.photo" alt="" />
          </div>

          <div class="member-nome">
            <template v-if="member.editando">
              <input
                type="text"
                :ref="`editField-${member.id}`"
                class="input-sm"
                :value="member.name"
                @keyup.enter="salvarEdicao(member.id)"
              />
            </template>
            <template v-else>
              <a :href="member.profileLink" target="_blank">{{
                member.name
              }}</a>
            </template>
          </div>

          <div class="member-actions">
            <button
              class="btn btn-warning"
              @click="cancelarEdicao(member.id)"
              v-if="member.editando"
            >
              Cancelar
            </button>

            <button
              class="btn btn-success ml-1"
              @click="salvarEdicao(member.id)"
              v-if="member.editando"
            >
              Salvar
            </button>
            <button
              class="btn btn-info"
              @click="editarMembro(member.id)"
              v-else-if="!drawActive"
            >
              <font-awesome-icon icon="pen" />
            </button>
            <button
              class="btn btn-danger ml-1"
              @click="excluir(member)"
              v-if="!member.editando"
            >
              <font-awesome-icon icon="trash" />
            </button>
          </div>
        </li>
      </ul>

      <a
        href="#"
        class="btn btn-outline p-5 btn-lg"
        @click.prevent="reiniciar()"
        v-if="drawActive"
      >
        <font-awesome-icon icon="undo-alt" />
        Reiniciar
      </a>
    </template>

    <div class="text-center mt-5" v-if="!loading">
      Done with <font-awesome-icon icon="heart" color="red" /> by the
      <a href="http://www.devpp.com.br" target="_blank">DevPP Community</a>
    </div>
  </div>
</template>

<script>
import membersService from "@/services/memberService";

let _membersList = [];
const _emptyMemberPhoto =
  "http://res.cloudinary.com/dwtuxv53y/image/upload/v1519940593/avatar_operqm.gif";

export default {
  name: "MeetupSorteio",
  data() {
    return {
      groupName: "",
      meetupId: "",
      keyword: "",
      members: [],
      loading: false,
      eventIdInput: "",
      drawActive: false,
      isAnError: false,
      groupFound: false
    };
  },
  methods: {
    async listarParticipantes() {
      this.loading = true;
      this.isAnError = false;

      _membersList = this.members = [];
      if (!this.meetupId) {
        _membersList = await membersService.getMembers(this.groupName);
      } else {
        _membersList = await membersService.getEventRSVP(
          this.groupName,
          this.meetupId
        );
      }

      if (_membersList.length === 0 || _membersList.errors != undefined) {
        this.isAnError = true;
      } else {
        _membersList.forEach(item => {
          item.photo = item.photo ? item.photo.thumb_link : _emptyMemberPhoto;
          item.profileLink = `https://www.meetup.com/${this.groupName}/members/${item.id}`;
        });

        this.groupFound = true;
      }

      this.members = _membersList;

      this.loading = false;
    },

    filtrarListaPorNome() {
      this.members = _membersList;

      this.members = this.members.filter(
        item => item.name.toLowerCase().indexOf(this.keyword) > -1
      );
    },

    excluir(member) {
      this.members = _membersList;

      _membersList = this.members = this.members.filter(
        item => item.id !== member.id
      );

      this.drawActive = false;
      this.keyword = "";
      this.filtrarListaPorNome();
    },

    adicionar() {
      this.keyword = "";
      setTimeout(() => {
        const nome = prompt("Digite o nome");
        if (nome) {
          // add elements to the beginning of the array
          this.members.unshift({
            id: new Date().getTime(),
            name: nome,
            date: "just now",
            photo:
              "http://res.cloudinary.com/dwtuxv53y/image/upload/v1519940593/avatar_operqm.gif"
          });
        }
        _membersList = this.members;
        this.filtrarListaPorNome();
      }, 0);
    },

    editarMembro(id) {
      _membersList.forEach(member => {
        if (member.id === id) {
          member.editando = true;
        }
      });

      this.$forceUpdate();
    },

    cancelarEdicao(id) {
      _membersList.forEach(member => {
        if (member.id === id) {
          member.editando = false;
        }
      });

      this.$forceUpdate();
    },

    salvarEdicao(id) {
      let member = this.members.filter(item => item.id === id)[0];

      member.name = this.$refs[`editField-${id}`][0].value;
      member.editando = false;

      this.members.forEach(item => {
        if (item.id === member.id) {
          item = member;
        }
      });

      _membersList.forEach(item => {
        if (item.id === member.id) {
          item = member;
        }
      });

      this.$forceUpdate();
      this.filtrarListaPorNome();
    },

    sortear() {
      this.drawActive = true;
      this.members = _membersList;

      const qntOfMembers = this.members.length;
      const randomMember = () => {
        let winnerPos = Math.round(Math.random() * qntOfMembers);
        this.members = [_membersList[winnerPos]];
      };

      const randomInterval = setInterval(function() {
        randomMember();
      }, 200);

      setTimeout(() => {
        clearInterval(randomInterval);
        this.$forceUpdate();
      }, 5000);
    },

    reiniciar() {
      this.drawActive = false;
      this.members = _membersList;
      this.keyword = "";
    },

    voltar() {
      this.groupName = "";
      this.meetupId = "";
      this.isAnError = false;
      this.groupFound = false;
      this.keyword = "";
      this.members = _membersList = [];
    }
  },
  watch: {
    keyword: {
      handler: "filtrarListaPorNome"
    }
  }
};
</script>

<style lang="scss" scoped>
.app-sorteio {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-weight: normal;
}

input.input-lg {
  border: solid 1px #ccc;
  padding: 13px;
  border-radius: 6px;
  width: 50%;
  font-size: 2rem;
  outline: none;
  text-align: center;
}

input.input-sm {
  border: solid 1px #ccc;
  padding: 3px;
  border-radius: 3px;
  outline: none;
}

/* nav a,
.options a {
  display: inline-block;
  padding: 10px 15px;
}

.options a {
  border: solid #ccc;
  border-radius: 6px;
  text-decoration: none;
} */

ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  list-style-type: none;
  padding: 0;

  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 280px;
    height: 280px;
    margin: 0 10px 10px;

    padding: 10px;
    border: solid 1px #ccc;
    border-radius: 8px;

    img {
      width: 100px;
    }

    &:hover {
      background: #d7f2e6;
    }

    div {
      padding: 5px;
    }
  }
}

.btn {
  cursor: pointer;
  outline: none;
}

a {
  color: #42b983;
  box-shadow: unset !important;

  &:hover {
    color: #42b983;
  }
}

.loading {
  font-size: 100px;
  padding: 50px;
  position: absolute;
  top: calc(50% - 200px);
}
</style>
