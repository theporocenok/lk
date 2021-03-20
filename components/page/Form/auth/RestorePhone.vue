<template>
  <v-container fill-height="fill-height">
    <v-layout
      align-center
      justify-center
    >
      <v-flex
        class="text-center"
        style="max-width: 350px"
      >
        <v-layout
          class="display-1 mb-3"
          align-center
          justify-center
        >
          <span class="text-xl mr-2">{{ $t('app_name') }}</span>
          <div>
            <v-img
              :src="require('~/assets/images/logo.png')"
              width="60px"
            />
          </div>
        </v-layout>
            
        <v-card light="light">
          <v-card-text>
            <div class="subheading">
              <span>  {{ $t('restore_form.title') }}</span>
            </div>
            <v-progress-circular
              v-if="entrancing"
              indeterminate
              :color="defaultColor"
            />
            <template v-if="success_changed">
              <div class="headline my-10">
                {{ $t('restore_form.success_changed') }}
              </div>
              <v-btn
                :color="defaultColor"
                dark
                to="/auth/login"
              >
                {{ $t('restore_form.success_enter') }}
              </v-btn>
            </template>
            <v-form
              v-else-if="!entrancing"
              @submit.prevent="doNothing"
            >
              <v-text-field
                v-model="form.phone"
                v-mask="'+7 (###) ###-##-##'"
                :color="defaultColor"
                :label="$t('restore_form.phone')"
                type="phone"
                light="light"
                prepend-icon="phone"
                name="phone"
              />

              <template v-if="code_sended">
                <v-text-field
                  v-model="form.code"
                  :color="defaultColor"
                  :label="$t('restore_form.code')"
                  type="number"
                  light="light"
                  prepend-icon="mdi-numeric"
                  name="code"
                />

                <v-text-field
                  v-model="form.password"
                  :color="defaultColor"
                  :label="$t('restore_form.password')"
                  type="password"
                  light="light"
                  prepend-icon="mdi-lock-open-check"
                  name="password"
                />

                <v-text-field
                  v-model="form.password_confirmation"
                  :color="defaultColor"
                  :label="$t('restore_form.password_confirmation')"
                  type="password"
                  light="light"
                  prepend-icon="mdi-lock-open-check"
                  name="password_confirmation"
                />
              </template>

              <v-alert
                v-if="errors.length"
                :value="true"
                type="error"
              >
                {{ $t('restore_form.error') }}
              </v-alert>


              <v-btn
                v-if="!code_sended"
                block="block"
                :color="defaultColor"
                class="white--text"
                :disabled="entrancing"
                @click="forgot"
              >
                {{ $t('restore_form.get_code') }}
              </v-btn>
              <v-btn
                v-else
                block="block"
                :color="defaultColor"
                class="white--text"
                :disabled="entrancing"
                @click="restore"
              >
                {{ $t('restore_form.restore') }}
              </v-btn>



              <v-layout
                class="mt-3"
                justify-space-around
              >
                <n-link
                  to="/auth/restore"
                >
                  {{ $t('restore_form.by_email') }}
                </n-link>
                <a
                  href="#"
                  @click.prevent="code_sended=true"
                >
                  {{ $t('restore_form.has_code') }}
                </a>
                <n-link
                  to="/auth/login"
                >
                  {{ $t('restore_form.i_remember') }}
                </n-link>
              </v-layout>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  
  export default {
    name: 'RestorePhone',
    data() {
      return {
        errors: [],
        entrancing: false,
        code_sended: false,
        success_changed: false,
        form: {
          phone: "",
          code: "",
          password: "",
          password_confirmation: "",
        },
        defaultColor: '#006e4c'
      };
    },
    methods: {
        doNothing(){
            return false;
        },
        async forgot(){
          this.entrancing = true;
          let {data} = (await this.$api.Auth.forgot(this.form)).data;
          if(data.sended==true){
              this.code_sended = true;
          }
          this.entrancing = false;
        },
        async restore(){
          this.entrancing = true;
          let {data} = (await this.$api.Auth.restore(this.form)).data;
          if(data.changed==true){
              this.success_changed = true;
          }
          this.entrancing = false;
        },
      async getMe() {
        const {data} = (await this.$api.Auth.me()).data;
        this.$auth.setUser(data);
      },
    }
  };
</script>
