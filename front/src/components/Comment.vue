<template>
  <div class="comment">
    <div class="comment_top">
      <div class="comment_top_intro">
        <div class="comment_username" v-if="showAction()">
          <router-link class="comment_username_link" :to="{ name: 'utilisateur', params: { userId: idUser } }" >{{ username }}</router-link>
        </div>
        <div class="comment_username" v-if="dontShowAction()">{{ username }}</div>
        <span>&nbsp;-&nbsp;</span>
        <div class="comment_date">{{ date }}</div>
      </div>
      <div>
        <i v-if="showAction()" @click="editComment();showEdit()" @keyup.enter="editComment();showEdit()" tabindex="0" class="fas fa-ellipsis-h comment_edit fa-2x"></i>
        <ul class="comment_edit_list" v-if="showEditComment && edit">
          <li class="comment_edit_list_item" @click="$emit('update')" @keyup.enter="$emit('update')" tabindex="0"><i class="fas fa-pen comment_edit_list_item_icon"></i>Modifier</li>
          <li class="comment_edit_list_item" @click="$emit('delete')" @keyup.enter="$emit('delete')" tabindex="0"><i class="fas fa-trash-alt comment_edit_list_item_icon"></i>Supprimer</li>
      </ul>
      </div>
    </div>
    <div class="comment_content">
      {{ content }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Comment',
  data() {
    return {
      showEditComment: false
    }
  },
  props: {
    username: String,
    date: String,
    content: String,
    idUser: Number
  },
  computed: {
    ...mapState(['edit'])
  },
  methods: {
    ...mapActions(['showEdit', 'closeEdit']),
    editComment(){
      if(this.showEditComment == false){
        return this.showEditComment = true
      } else { 
        return this.showEditComment = false 
        }
    },
    showAction(){
      const currentUser = JSON.parse(localStorage.getItem('name'));
      let show = false;
      if(this.idUser == currentUser.value.id || currentUser.value.role == 'moderator'){
        return show = true
      }
      return show
    },
    dontShowAction(){
      const currentUser = JSON.parse(localStorage.getItem('name'));
      let show = true;
      if(this.idUser == currentUser.value.id || currentUser.value.role == 'moderator'){
        return show = false
      }
      return show
    }
  }
};
</script>

<style scoped lang="scss">
.comment {
  background: #fff;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0 0 15px 0;
  &_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &_intro {
      display: flex;
      align-items: center;
    }
  }
  &_username {
    font-family: $bold-text;
    &_link {
      text-decoration: none;
      color:$text-color;
    }
  }
  &_date {
    font-size:14px;
  }
  &_edit {
    color: $grey;
    cursor: pointer;
    &:hover {
      color: darken($grey, 10%);
    }
    &_list {
      width: 150px;
      text-align: center;
      position: absolute;
      background: #fff;
      padding: 0;
      margin: 0;
      transform: translate(32px, -6px) translate(-100%);
      border: 1px solid $grey;
      border-radius: 6px;
      &_item {
        margin: 0 auto;
        cursor: pointer;
        list-style: none;
        padding: 10px 0;
        border-bottom: 1px solid $grey;
        &_icon {
          margin: 0 5px 0 0;
        }
      }
    }
  }
  &_content {
    padding: 10px 0 15px 0;
    border-bottom: 1px solid $grey;
  }
}
</style>
