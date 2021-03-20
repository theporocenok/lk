<template>
  <div>
    <template v-if="showTitle">
      <v-card-title
        v-if="model.translate"
        class="headline"
      >
        {{ $t(model.translate) }} <span v-if="model.protected">({{ $t('crud.protected') }})</span>
      </v-card-title>
      <span v-else>{{ model.name }}</span>
    </template>
    <v-layout style="position: relative">
      <v-container fluid>
        <v-card
          :elevation="elevation"
        >
          <div>
            <v-layout
              align-items-center
              justify-space-between
              class="p-2"
            >
              <slot name="filters">
                <v-flex xs3>
                  <v-text-field
                    v-if="model.searchable"
                    v-model="searchWatcher"
                    :loading="loadingSearch"
                    color="#37bc9b"
                    :placeholder="translate('crud.search')"
                    clearable
                    class="m-0 p-0"
                  />
                </v-flex>
              </slot>
              <div>
                <slot name="left_top_button" />
                <v-btn
                  v-if="model.show.refresh"
                  small
                  :color="$config.defaultColor"
                  dark
                  class="ma-5"
                  @click="refreshNow(true)"
                >
                  Обновить
                </v-btn>
                <v-btn
                  v-if="model.show.add && !hideCreateBtn"
                  small
                  :color="$config.defaultColor"
                  dark
                  class="ma-5"
                  @click="createButtonEvent"
                >
                  {{ $t('crud.create') }}
                </v-btn>
                <slot name="right_top_button" />
              </div>
            </v-layout>
          </div>
          <SortMobile
            :sort-by-list="options.fields"
            :show-sort="showSort"
            @refresh="(sortByValue) => {sortBy = sortByValue}"
          />
          <v-data-table
            :headers="!!customHeaders && customHeaders.length > 0 ? customHeaders : headers"
            :header-props="{sortByText: 'Сортировать по'}"
            :items="response.items"
            :items-per-page="response.meta.per_page"
            :item-class="itemClass"
            :page="response.meta.page"
            :server-items-length="response.meta.total"
            :page-count="response.meta.last_page"
            :loading="loading"
            :dense="model.table.dense"
            :options.sync="options"
            :hide-default-header="hideDefaultHeader"
            :hide-default-footer="hideDefaultFooter || response.meta.total < response.meta.per_page || $helpers.isMobile()"
            :footer-props="footerProps"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            :show-expand="showExpand"
            :sort-by="!showSort && !!sortByCustom ? sortByCustom : sortBy"
            :sort-desc="sortDesc"
            :mobile-breakpoint="mobileBreakpoint"
            class="hide-mobile-table-header pb-2"
            @click:row="clickRow"
          >
            <template slot="progress">
              <v-progress-linear
                v-show="loading"
                indeterminate
                :color="$config.defaultColor"
              />
            </template>
            <template
              v-if="!response.items.length && !loading"
              slot="no-data"
            >
              <v-alert
                v-if="!response.items.length"
                :value="true"
              >
                <span> Данных нет </span>
              </v-alert>
            </template>
            <template slot="loading">
              <v-alert :value="true">
                <span>{{ translate('crud.loading') }}</span>
              </v-alert>
            </template>
            <template
              v-for="(modelSlot, key) of model.table.slots"
              #[modelSlot.column]="item"
            >
              <slot
                :item="item.item"
                :name="`${modelSlot.column}`"
              >
                {{ modelSlot.value ? modelSlot.value(item.item) : "" }}
              </slot>
            </template>
            <template
              v-if="activeAction"
              v-slot:item.action="item"
            >
              <v-layout>
                <slot
                  name="action_buttons_before"
                  :item="item.item"
                />
                <v-icon
                  v-if="model.show.edit"
                  small
                  class="mr-2"
                  @click.stop="editButtonEvent(item.item)"
                >
                  edit
                </v-icon>
                <v-icon
                  v-if="model.show.delete"
                  small
                  @click="deleteButtonEvent(item.item.id)"
                >
                  delete
                </v-icon>
                <slot
                  name="action_buttons_after"
                  :item="item.item"
                />
              </v-layout>
            </template>
            <template
              v-if="customItem"
              v-slot:item="dataTableObj"
            >
              <slot
                name="custom_item"
                :item="dataTableObj.item"
              />
            </template>
            <template
              v-if="$helpers.isMobile()"
              #footer="{props}"
            >
              <v-layout
                v-if="response.meta.total > response.meta.per_page"
                class="px-2 mt-4"
                align-center
                justify-space-between
                :wrap="false"
              >
                <div class="text-no-wrap caption font-family--rubik mr-3">
                  {{ props.itemsPerPageText }}
                </div>
                <v-select
                  v-model="options.itemsPerPage"
                  hide-details
                  :color="$config.defaultColor"
                  :items="[5, 10, 15, 50]"
                  class="tcsmSelect-mobile font-family--rubik caption mr-2"
                  outlined
                  @change="refreshTable = true"
                />
                <div class="text-no-wrap caption font-family--rubik mr-2">
                  {{ (response.meta.page - 1) * response.meta.per_page + 1 }}-{{ lastLoadedRow }} из {{ response.meta.total }}
                </div>
                <v-layout justify-end>
                  <v-btn
                    min-width="unset"
                    width="32"
                    height="32"
                    color="#006e4c"
                    depressed
                    outlined
                    class="mr-3"
                    @click="response.meta.page - 1 > 0 ? response.meta.page-- : response.meta.page"
                  >
                    <v-icon>
                      arrow_back
                    </v-icon>
                  </v-btn>
                  <v-btn
                    min-width="unset"
                    width="32"
                    height="32"
                    color="#006e4c"
                    depressed
                    outlined
                    class=""
                    @click="response.meta.page + 1 <= response.meta.total ? response.meta.page++ : response.meta.page"
                  >
                    <v-icon>
                      arrow_forward
                    </v-icon>
                  </v-btn>
                </v-layout>
              </v-layout>
            </template>
          </v-data-table>
          <div
            v-if="response.items.length > 0 && response.meta.total > response.meta.per_page && !$helpers.isMobile()"
            class="text-xs-center pt-2"
          >
            <v-pagination
              v-model="response.meta.page"
              :length="response.meta.last_page"
              :total-visible="10"
              prev-icon="keyboard_arrow_left"
              next-icon="keyboard_arrow_right"
              :color="$config.defaultColor"
              :disabled="loading"
            />
          </div>
        </v-card>
      </v-container>
    </v-layout>
    
    <v-overlay
      :value="dialogLoader"
      style="z-index: 2"
    >
      <v-progress-circular
        indeterminate
        size="64"
        :color="$config.defaultColor"
      />
    </v-overlay>

    <TcsmDialog
      v-if="!dialogLoader"
      :dialog="editDialog"
      persistent
      :max-width="model.dialogWidth || 700"
      hide-footer
      @close-dialog="editDialog = false"
    >
      <template v-slot:title>
        {{ actionText }}
      </template>
      <template v-slot:main>
        <v-form @submit.stop.prevent="doNothing">
          <slot
            name="form"
            :form="form"
            :update="(items) => sendUpdateForm(items)"
            :items="createEditedItem()"
            :create="(items) => sendCreateForm(items)"
            :close="closeEditDialog"
            :defaultColor="$config.defaultColor"
          >
            <div>
              <div v-if="model.show.lang">
                <Languages
                  class="mb-5"
                  :language-fields="model.languages"
                  :lang-content="langContent"
                  :translate-data="translateData"
                  :color="$config.defaultColor"
                  @input="inputLanguageContent"
                />
              </div>

              <v-tabs
                v-model="modelTab"
                background-color="transparent"
                :color="$config.defaultColor"
                centered
                grow
                :height="(!tabs || tabs.length<2) ? 0 : 'undefined'"
              >
                <v-tab
                  v-for="tab of tabs"
                  :key="tab.key"
                  :href="`#tab-${tab.key}`"
                >
                  {{ tab.title }}
                </v-tab>

                <v-tab-item
                  v-for="tab in tabs"
                  :key="tab.key"
                  :value="`tab-${tab.key}`"
                >
                  <v-card
                    flat
                    tile
                  >
                    <v-card-text>
                      <template
                        v-for="(field,index) in form"
                      >
                        <template v-if="field.tab == tab.key || !field.tab">
                          <slot
                            v-if="!model.only_slot"
                            :name="`form.${field.key}`"
                            :field="field"
                          >
                            <template v-if="checkDrawCondition(form, field)">
                              <div
                                v-if="field.type == 'file'"
                                :key="index"
                                class="file"
                              >
                                <v-layout
                                  justify-start
                                  align-center
                                >
                                  <template v-if="field.label_tootlip">
                                    <span
                                      class="subtitle-1 font-weight-lighter mr-3"
                                      style="color:#000;line-height: 16px;"
                                    >
                                      <CrudTooltip :field="field" />
                                    </span>
                                  </template>
                                  <v-file-input
                                    v-model="filesArray[field.key]"
                                    :name="field.key"
                                    accept="image/*"
                                    :multiple="field.multiple"
                                    :label="!field.label_tootlip ? translate(field.label) : ''"
                                    @change="changedFile(filesArray[field.key], field)"
                                    @click:clear="clearFiles(field)"
                                  >
                                    <template
                                      v-if="field.label_tootlip"
                                      v-slot:prepend
                                    >
                                      <CrudTooltip :field="field" />
                                    </template>
                                  </v-file-input>
                                </v-layout>

                                <template
                                  v-if="field.value.id"
                                >
                                  <v-layout
                                    justify-start
                                    wrap
                                  >
                                    <div
                                      style="position:relative;border: solid 1px #000;width:80px;height:80px;"
                                      class="mr-5"
                                    >
                                      <v-img
                                        v-if="field.value.sizes && field.value.sizes.length"
                                        :src="field.value.sizes[0].url"
                                        width="80"
                                        height="80"
                                      />

                                      <v-btn
                                        fab
                                        color="red"
                                        dark
                                        x-small
                                        absolute
                                        style="top:-10px;right:-10px;width: 20px;height: 20px;"
                                        @click="deleteFile(field, field.value.id)"
                                      >
                                        x
                                      </v-btn>

                                      <template v-if=" field.value.sizes.length">
                                        <template v-for="(val,key) in field.value.sizes">
                                          <a
                                            :key="key"
                                            :href="val.url"
                                            target="_blank"
                                          >
                                            <v-btn
                                              fab
                                              color="black"
                                              dark
                                              x-small
                                              absolute
                                              :title="val.key"
                                              :style="`top:${((key+1)*20)}px;right:-10px;width: 20px;height: 20px;`"
                                            >
                                              <v-icon>mdi-link-variant</v-icon>
                                            </v-btn>
                                          </a>
                                        </template>
                                      </template>
                                    </div>
                                  </v-layout>
                                </template>
                                <template v-else-if="field.value.length">
                                  <v-layout
                                    justify-start
                                    wrap
                                  >
                                    <template
                                      v-for="img of field.value"
                                    >
                                      <div
                                        v-if="img.id"
                                        :key="img.id"
                                        style="position:relative;border: solid 1px #000;width:80px;height:80px;"
                                        class="mr-5"
                                      >
                                        <v-img
                                          v-if="img.sizes.length"
                                          :src="img.sizes[0].url"
                                          width="80"
                                          height="80"
                                        />
                                        <v-btn
                                          fab
                                          color="red"
                                          dark
                                          x-small
                                          absolute
                                          style="top:-10px;right:-10px;width: 20px;height: 20px;"
                                          @click="deleteFile(field, img.id)"
                                        >
                                          x
                                        </v-btn>
                                        <template v-if="img.sizes">
                                          <template v-for="(val,key) in img.sizes">
                                            <a
                                              :key="key"
                                              :href="val.url"
                                              target="_blank"
                                            >
                                              <v-btn
                                                fab
                                                color="black"
                                                dark
                                                x-small
                                                absolute
                                                :title="val.key"
                                                :style="`top:${((key+1)*20)}px;right:-10px;width: 20px;height: 20px;`"
                                              >
                                                <v-icon>mdi-link-variant</v-icon>
                                              </v-btn>
                                            </a>
                                          </template>
                                        </template>
                                      </div>
                                    </template>
                                  </v-layout>
                                </template>
                              </div>

                              <div
                                v-if="field.type == 'textarea'"
                                :key="index"
                              >
                                <v-layout justify-end>
                                  <v-switch
                                    v-if="field.editor_switch === false ? false : true"
                                    v-model="field.editor"
                                    class="mt-0 hide-v-messages"
                                    inset
                                    label="Визуальный редактор"
                                  />
                                </v-layout>


                                <template v-if="field.editor">
                                  <v-layout
                                    justify-start
                                    align-center
                                  >
                                    <span
                                      v-if="field.editor"
                                      class="subtitle-1 font-weight-lighter mr-3"
                                      style="color:#000;line-height: 16px;"
                                    >
                                      <template v-if="field.label_tootlip">
                                        <CrudTooltip :field="field" />
                                      </template>
                                      <template v-else>
                                        {{ translate(field.label) }}
                                      </template>
                                    </span>


                                    <TipTap
                                      :width="'100%'"
                                      :value.sync="field.value"
                                    />
                                  </v-layout>
                                </template>
                                <template v-else>
                                  <v-textarea
                                    v-model="field.value"
                                    :color="field.color || $config.defaultColor"
                                    :placeholder="translate(field.placeholder)"
                                    :label="!field.label_tootlip ? translate(field.label) : ''"
                                    :auto-grow="field.auto_grow === false ? false : true"
                                    :rows="2"
                                    :counter="field.counter"
                                    :counter-value="field.counter_value"
                                    :rules="field.rules"
                                    :filled="field.filled"
                                  >
                                    <template
                                      v-if="field.label_tootlip"
                                      v-slot:prepend
                                    >
                                      <CrudTooltip :field="field" />
                                    </template>
                                  </v-textarea>
                                </template>
                              </div>

                              <v-text-field
                                v-if="field.type === 'textField' && field.mask"
                                :key="index"
                                v-model="field.value"
                                v-mask="field.mask"
                                :color="field.color || $config.defaultColor"
                                :label="!field.label_tootlip ? translate(field.label) : ''"
                                :placeholder="translate(field.placeholder)"
                                :counter="field.counter"
                                :counter-value="field.counter_value"
                                :rules="field.rules"
                                :type="field.textFieldType"
                                :step="field.step"
                                :prepend-icon="field.prepend_icon"
                                :prefix="typeof field.prefix ==='function' ? field.prefix(createEditedItem()) : field.prefix"
                                :disabled="getDisabled(field)"
                              >
                                <template
                                  v-if="field.label_tootlip"
                                  v-slot:prepend
                                >
                                  <CrudTooltip :field="field" />
                                </template>
                              </v-text-field>

                              <v-text-field
                                v-else-if="field.type === 'textField'"
                                :key="index"
                                v-model="field.value"
                                :color="field.color || $config.defaultColor"
                                :label="!field.label_tootlip ? translate(field.label) : ''"
                                :placeholder="translate(field.placeholder)"
                                :counter="field.counter"
                                :counter-value="field.counter_value"
                                :outlined="$helpers.isMobile()"
                                :rules="field.rules"
                                :type="field.textFieldType"
                                :step="field.step"
                                :prepend-icon="field.prepend_icon"
                                :prefix="typeof field.prefix ==='function' ? field.prefix(createEditedItem()) : field.prefix"
                                :disabled="getDisabled(field)"
                              >
                                <template
                                  v-slot:prepend
                                >
                                  <CrudTooltip
                                    v-if="field.label_tootlip"
                                    :field="field"
                                  />
                                </template>
                              </v-text-field>

                              <v-slider
                                v-if="field.type === 'slider'"
                                :key="index"
                                v-model="field.value"
                                :color="field.color || $config.defaultColor"
                                :label="translate(field.label)"
                                :step="field.step"
                                :max="field.max"
                                :min="field.min"
                                :hide-details="field.hide_details"
                                :placeholder="translate(field.placeholder)"
                                :prepend-icon="field.prepend_icon"
                                :append-icon="field.append_icon"
                                :thumb-label="field.thumb_label"
                                :thumb-size="field.thumb_size"
                              >
                                <template
                                  v-if="field.show_number"
                                  v-slot:append
                                >
                                  <v-text-field
                                    v-model="field.value"
                                    class="mt-0 pt-0"
                                    hide-details
                                    :step="field.step"
                                    :outlined="$helpers.isMobile()"
                                    single-line
                                    type="number"
                                    style="width: 60px"
                                  />
                                </template>
                              </v-slider>
                              <v-menu
                                v-if="field.type === 'datePicker'"
                                :key="index"
                                v-model="field.show"
                                :close-on-content-click="field.range ? false : true"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                                :color="field.color ? field.color : $config.defaultColor"
                              >
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                    :value="convertValue(field)"
                                    :label="translate(field.label)"
                                    :outlined="$helpers.isMobile()"
                                    :prepend-icon="!$helpers.isMobile() ? 'event' : ''"
                                    :append-icon="$helpers.isMobile() ? 'event' : ''"
                                    readonly
                                    v-on="on"
                                  />
                                </template>
                                <v-date-picker
                                  v-model="field.value"
                                  :type="field.month === true ? 'month' : 'date'"
                                  :range="field.range"
                                  no-title
                                  scrollable
                                  first-day-of-week="1"
                                  locale="ru-ru"
                                />
                              </v-menu>
                              <v-layout
                                v-if="field.type === 'select'"
                                :key="index"
                              >
                                <v-select
                                  v-model="field.value"
                                  :color="$config.defaultColor"
                                  :items="field.items"
                                  :item-text="field.item_text"
                                  :outlined="$helpers.isMobile()"
                                  :item-value="field.item_value"
                                  :label="!field.label_tootlip ? translate(field.label) : ''"
                                  :multiple="field.multiple"
                                  :chips="field.chips"
                                  :disabled="getDisabled(field)"
                                  @change="changeEvent(field)"
                                >
                                  <template
                                    v-if="field.label_tootlip"
                                    v-slot:prepend
                                  >
                                    <CrudTooltip :field="field" />
                                  </template>
                                </v-select>
                              </v-layout>
                              <v-layout
                                v-if="field.type == 'autocomplete'"
                                :key="index"
                              >
                                <v-autocomplete
                                  v-model="field.value"
                                  :color="$config.defaultColor"
                                  :items="field.items"
                                  :item-text="field.item_text"
                                  :outlined="$helpers.isMobile()"
                                  :item-value="field.item_value"
                                  :label="!field.label_tootlip ? translate(field.label) : ''"
                                  :multiple="field.multiple"
                                  :chips="field.chips"
                                  :disabled="getDisabled(field)"
                                  :clearable="field.clearable"
                                  autocomplete="off"
                                  :deletable-chips="field.deletable_chips"
                                  :search-input.sync="field.search_input"
                                  @change="changeEvent(field)"
                                  @input="inputEvent(field)"
                                  @keyup="keyUpEvent(field)"
                                >
                                  <template
                                    v-if="field.label_tootlip"
                                    v-slot:prepend
                                  >
                                    <CrudTooltip :field="field" />
                                  </template>
                                </v-autocomplete>
                              </v-layout>
                              <v-layout
                                v-if="field.type == 'checkbox'"
                                :key="index"
                              >
                                <v-checkbox
                                  v-model="field.value"
                                  :color="field.color || $config.defaultColor"
                                  :label="translate(field.label)"
                                  :disabled="getDisabled(field)"
                                />
                              </v-layout>
                              <v-layout
                                v-if="field.type == 'switch'"
                                :key="index"
                              >
                                <v-switch
                                  v-model="field.value"
                                  :color="field.color || $config.defaultColor"
                                  :label="!field.label_tootlip ? translate(field.label) : ''"
                                  :disabled="getDisabled(field)"
                                >
                                  <template
                                    v-if="field.label_tootlip"
                                    v-slot:prepend
                                  >
                                    <CrudTooltip :field="field" />
                                  </template>
                                </v-switch>
                              </v-layout>
                              <v-layout
                                v-if="field.type == 'radio-group'"
                                :key="index"
                              >
                                <v-radio-group
                                  v-model="field.value"
                                  :color="field.color || $config.defaultColor"
                                  :label="translate(field.label)"
                                  :items="field.items"
                                  :item-text="field.item_text"
                                  :item-value="field.item_value"
                                  :disabled="getDisabled(field)"
                                >
                                  <v-radio />
                                  <v-radio />
                                </v-radio-group>
                              </v-layout>
                              <v-layout
                                v-if="field.type == 'select-color'"
                                :key="index"
                              >
                                <v-select
                                  v-model="field.value"
                                  :color="field.value ? findColor(field.value,field.items) : $config.defaultColor"
                                  :items="field.value"
                                  :item-text="field.item_text"
                                  :item-value="field.item_value"
                                  :label="translate(field.label)"
                                  :outlined="$helpers.isMobile()"
                                  :multiple="field.multiple"
                                  :chips="field.chips"
                                >
                                  <template
                                    slot="item"
                                    slot-scope="data"
                                  >
                                    <div
                                      :style="'background-color:' + data.item.text"
                                      class="v-select__color-picker"
                                    >
                                      {{ data.item.text }}
                                    </div>
                                  </template>
                                </v-select>
                                <div
                                  v-if="field.type == 'select-color' && field.value"
                                  class="ml-1"
                                >
                                  <div
                                    :style="'background-color:' + findColor(field.value,field.items)"
                                    style="width: 50px;height: 50px;"
                                  />
                                </div>
                              </v-layout>
                              <v-layout
                                v-if="field.type == 'colorPicker'"
                                :key="index"
                                align-item-center
                                column
                                style="flex: 0 0 auto"
                              >
                                <div class="title">
                                  Выбор цвета
                                </div>
                                <v-color-picker
                                  v-model="field.value"
                                  hide-mode-switch
                                  mode="hexa"
                                />
                              </v-layout>

                              <div
                                v-if="field.after_text_copy"
                                :key="`copytext-${index}`"
                                class="caption mt-n5 mb-4"
                              >
                                {{ field.after_text_copy }}
                                <v-tooltip
                                  v-if="false"
                                  bottom
                                >
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      icon
                                      x-small
                                      @click="copyText(field.after_text_copy)"
                                      v-on="on"
                                    >
                                      <v-icon x-small>
                                        mdi-content-copy
                                      </v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Скопировать</span>
                                </v-tooltip>
                              </div>


                              <slot
                                v-if="field.type === 'slot'"
                                :name="`slot.${field.key}`"
                                :items="createEditedItem()"
                              />


                              <slot
                                v-if="field.key === 'after-form'"
                                name="after-form"
                                :items="createEditedItem()"
                              />
                            </template>


                            <v-card-actions
                              v-if="field.key === 'id' "
                              :key="index"
                              class="mt-2 px-0"
                            >
                              <v-layout
                                justify-end
                                :column="$helpers.isMobile()"
                                :reverse="$helpers.isMobile()"
                              >
                                <v-btn
                                  :color="$config.defaultColor"
                                  :class="`${$helpers.isMobile() ? 'mt-2 text-none body-1 font-family--rubik' : 'mr-2'}`"
                                  :height="`${$helpers.isMobile() ? '50' : ''}`"
                                  outlined
                                  @click="closeEditDialog"
                                >
                                  {{ $t('crud.cancel') }}
                                </v-btn>
                                <template v-if="field.value > 0">
                                  <v-btn
                                    :color="$config.defaultColor"
                                    :class="`${$helpers.isMobile() ? 'mt-2 text-none body-1 font-family--rubik' : 'mr-2'}`"
                                    dark
                                    :height="`${$helpers.isMobile() ? '50' : ''}`"
                                    :disabled="formSent"
                                    @click="sendUpdateForm({})"
                                  >
                                    {{ $t('crud.ok') }}
                                  </v-btn>
                                  <v-btn
                                    :color="$config.defaultColor"
                                    :class="`${$helpers.isMobile() ? 'text-none body-1 font-family--rubik' : ''}`"
                                    dark
                                    :height="`${$helpers.isMobile() ? '50' : ''}`"
                                    :disabled="formSent"
                                    @click="sendUpdateForm({},false)"
                                  >
                                    {{ $t('crud.only_save') }}
                                  </v-btn>
                                </template>
                                <template v-else>
                                  <v-btn
                                    :color="$config.defaultColor"
                                    :class="`${$helpers.isMobile() ? 'text-none body-1 font-family--rubik mt-2' : ''}`"
                                    dark
                                    :height="`${$helpers.isMobile() ? '50' : ''}`"
                                    @click="sendCreateForm({})"
                                  >
                                    {{ $t('crud.ok') }}
                                  </v-btn>
                                  <v-btn
                                    :color="$config.defaultColor"
                                    :class="`${$helpers.isMobile() ? 'text-none body-1 font-family--rubik' : ''}`"
                                    dark
                                    :height="`${$helpers.isMobile() ? '50' : ''}`"
                                    @click="sendCreateForm({},false)"
                                  >
                                    {{ $t('crud.only_save') }}
                                  </v-btn>
                                </template>
                              </v-layout>
                            </v-card-actions>
                          </slot>
                          <slot
                            v-if="model.only_slot"
                            :name="`form.${field.key}`"
                            :field="field"
                          />
                        </template>
                      </template>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </div>
          </slot>
        </v-form>
      </template>
    </TcsmDialog>

    <template v-if="false">
      <v-dialog
        v-if="!dialogLoader"
        v-model="editDialog"
        persistent
        :max-width="model.dialogWidth || 700"
        content-class="r-dialog"
      >
        <div style="position: relative">
          <v-btn
            height="40"
            width="40"
            min-width="0"
            depressed
            absolute
            dark
            rounded
            :color="$config.defaultColor"
            class="r-dialog__close px-0"
            @click="closeEditDialog"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </div>
        <v-card>
          <v-container
            grid-list-sm
            fluid
            style="position:relative"
          >
            <v-btn
              v-if="false"
              absolute
              right
              :color="$config.defaultColor"
              x-small
              fab
              class="white--text"
              style="z-index:101;"
              @click="closeEditDialog"
            >
              <v-icon>close</v-icon>
            </v-btn>

            <v-layout>
              <v-card-title>{{ actionText }}</v-card-title>
            </v-layout>
            <v-card-text>
              <v-form @submit.stop.prevent="doNothing">
                <slot
                  name="form"
                  :form="form"
                  :update="(items) => sendUpdateForm(items)"
                  :items="createEditedItem()"
                  :create="(items) => sendCreateForm(items)"
                  :close="closeEditDialog"
                  :defaultColor="$config.defaultColor"
                >
                  <div>
                    <div v-if="model.show.lang">
                      <Languages
                        class="mb-5"
                        :language-fields="model.languages"
                        :lang-content="langContent"
                        :translate-data="translateData"
                        :color="$config.defaultColor"
                        @input="inputLanguageContent"
                      />
                    </div>

                    <v-tabs
                      v-model="modelTab"
                      background-color="transparent"
                      :color="$config.defaultColor"
                      centered
                      grow
                      :height="(!tabs || tabs.length<2) ? 0 : 'undefined'"
                    >
                      <v-tab
                        v-for="tab of tabs"
                        :key="tab.key"
                        :href="`#tab-${tab.key}`"
                      >
                        {{ tab.title }}
                      </v-tab>

                      <v-tab-item
                        v-for="tab in tabs"
                        :key="tab.key"
                        :value="`tab-${tab.key}`"
                      >
                        <v-card
                          flat
                          tile
                        >
                          <v-card-text>
                            <template
                              v-for="(field,index) in form"
                            >
                              <template v-if="field.tab == tab.key || !field.tab">
                                <slot
                                  v-if="!model.only_slot"
                                  :name="`form.${field.key}`"
                                  :field="field"
                                >
                                  <template v-if="checkDrawCondition(form, field)">
                                    <div
                                      v-if="field.type == 'file'"
                                      :key="index"
                                      class="file"
                                    >
                                      <v-layout
                                        justify-start
                                        align-center
                                      >
                                        <template v-if="field.label_tootlip">
                                          <span
                                            class="subtitle-1 font-weight-lighter mr-3"
                                            style="color:#000;line-height: 16px;"
                                          >
                                            <CrudTooltip :field="field" />
                                          </span>
                                        </template>
                                        <v-file-input
                                          v-model="filesArray[field.key]"
                                          :name="field.key"
                                          accept="image/*"
                                          :multiple="field.multiple"
                                          :label="!field.label_tootlip ? translate(field.label) : ''"
                                          @change="changedFile(filesArray[field.key], field)"
                                          @click:clear="clearFiles(field)"
                                        >
                                          <template
                                            v-if="field.label_tootlip"
                                            v-slot:prepend
                                          >
                                            <CrudTooltip :field="field" />
                                          </template>
                                        </v-file-input>
                                      </v-layout>

                                      <template
                                        v-if="field.value.id"
                                      >
                                        <v-layout
                                          justify-start
                                          wrap
                                        >
                                          <div
                                            style="position:relative;border: solid 1px #000;width:80px;height:80px;"
                                            class="mr-5"
                                          >
                                            <v-img
                                              v-if="field.value.sizes && field.value.sizes.length"
                                              :src="field.value.sizes[0].url"
                                              width="80"
                                              height="80"
                                            />

                                            <v-btn
                                              fab
                                              color="red"
                                              dark
                                              x-small
                                              absolute
                                              style="top:-10px;right:-10px;width: 20px;height: 20px;"
                                              @click="deleteFile(field, field.value.id)"
                                            >
                                              x
                                            </v-btn>

                                            <template v-if=" field.value.sizes.length">
                                              <template v-for="(val,key) in field.value.sizes">
                                                <a
                                                  :key="key"
                                                  :href="val.url"
                                                  target="_blank"
                                                >
                                                  <v-btn
                                                    fab
                                                    color="black"
                                                    dark
                                                    x-small
                                                    absolute
                                                    :title="val.key"
                                                    :style="`top:${((key+1)*20)}px;right:-10px;width: 20px;height: 20px;`"
                                                  >
                                                    <v-icon>mdi-link-variant</v-icon>
                                                  </v-btn>
                                                </a>
                                              </template>
                                            </template>
                                          </div>
                                        </v-layout>
                                      </template>
                                      <template v-else-if="field.value.length">
                                        <v-layout
                                          justify-start
                                          wrap
                                        >
                                          <template
                                            v-for="img of field.value"
                                          >
                                            <div
                                              v-if="img.id"
                                              :key="img.id"
                                              style="position:relative;border: solid 1px #000;width:80px;height:80px;"
                                              class="mr-5"
                                            >
                                              <v-img
                                                v-if="img.sizes.length"
                                                :src="img.sizes[0].url"
                                                width="80"
                                                height="80"
                                              />
                                              <v-btn
                                                fab
                                                color="red"
                                                dark
                                                x-small
                                                absolute
                                                style="top:-10px;right:-10px;width: 20px;height: 20px;"
                                                @click="deleteFile(field, img.id)"
                                              >
                                                x
                                              </v-btn>
                                              <template v-if="img.sizes">
                                                <template v-for="(val,key) in img.sizes">
                                                  <a
                                                    :key="key"
                                                    :href="val.url"
                                                    target="_blank"
                                                  >
                                                    <v-btn
                                                      fab
                                                      color="black"
                                                      dark
                                                      x-small
                                                      absolute
                                                      :title="val.key"
                                                      :style="`top:${((key+1)*20)}px;right:-10px;width: 20px;height: 20px;`"
                                                    >
                                                      <v-icon>mdi-link-variant</v-icon>
                                                    </v-btn>
                                                  </a>
                                                </template>
                                              </template>
                                            </div>
                                          </template>
                                        </v-layout>
                                      </template>
                                    </div>

                                    <div
                                      v-if="field.type == 'textarea'"
                                      :key="index"
                                    >
                                      <v-layout justify-end>
                                        <v-switch
                                          v-if="field.editor_switch === false ? false : true"
                                          v-model="field.editor"
                                          class="mt-0 hide-v-messages"
                                          inset
                                          label="Визуальный редактор"
                                        />
                                      </v-layout>


                                      <template v-if="field.editor">
                                        <v-layout
                                          justify-start
                                          align-center
                                        >
                                          <span
                                            v-if="field.editor"
                                            class="subtitle-1 font-weight-lighter mr-3"
                                            style="color:#000;line-height: 16px;"
                                          >
                                            <template v-if="field.label_tootlip">
                                              <CrudTooltip :field="field" />
                                            </template>
                                            <template v-else>
                                              {{ translate(field.label) }}
                                            </template>
                                          </span>


                                          <TipTap
                                            :width="'100%'"
                                            :value.sync="field.value"
                                          />
                                        </v-layout>
                                      </template>
                                      <template v-else>
                                        <v-textarea
                                          v-model="field.value"
                                          :color="field.color || $config.defaultColor"
                                          :placeholder="translate(field.placeholder)"
                                          :label="!field.label_tootlip ? translate(field.label) : ''"
                                          :auto-grow="field.auto_grow === false ? false : true"
                                          :rows="2"
                                          :counter="field.counter"
                                          :counter-value="field.counter_value"
                                          :rules="field.rules"
                                          :filled="field.filled"
                                        >
                                          <template
                                            v-if="field.label_tootlip"
                                            v-slot:prepend
                                          >
                                            <CrudTooltip :field="field" />
                                          </template>
                                        </v-textarea>
                                      </template>
                                    </div>

                                    <v-text-field
                                      v-if="field.type === 'textField' && field.mask"
                                      :key="index"
                                      v-model="field.value"
                                      v-mask="field.mask"
                                      :color="field.color || $config.defaultColor"
                                      :label="!field.label_tootlip ? translate(field.label) : ''"
                                      :placeholder="translate(field.placeholder)"
                                      :counter="field.counter"
                                      :counter-value="field.counter_value"
                                      :rules="field.rules"
                                      :type="field.textFieldType"
                                      :step="field.step"
                                      :prepend-icon="field.prepend_icon"
                                      :prefix="typeof field.prefix ==='function' ? field.prefix(createEditedItem()) : field.prefix"
                                      :disabled="getDisabled(field)"
                                    >
                                      <template
                                        v-if="field.label_tootlip"
                                        v-slot:prepend
                                      >
                                        <CrudTooltip :field="field" />
                                      </template>
                                    </v-text-field>

                                    <v-text-field
                                      v-else-if="field.type === 'textField'"
                                      :key="index"
                                      v-model="field.value"
                                      :color="field.color || $config.defaultColor"
                                      :label="!field.label_tootlip ? translate(field.label) : ''"
                                      :placeholder="translate(field.placeholder)"
                                      :counter="field.counter"
                                      :counter-value="field.counter_value"
                                      :rules="field.rules"
                                      :type="field.textFieldType"
                                      :step="field.step"
                                      :prepend-icon="field.prepend_icon"
                                      :prefix="typeof field.prefix ==='function' ? field.prefix(createEditedItem()) : field.prefix"
                                      :disabled="getDisabled(field)"
                                    >
                                      <template
                                        v-slot:prepend
                                      >
                                        <CrudTooltip
                                          v-if="field.label_tootlip"
                                          :field="field"
                                        />
                                      </template>
                                    </v-text-field>

                                    <v-slider
                                      v-if="field.type === 'slider'"
                                      :key="index"
                                      v-model="field.value"
                                      :color="field.color || $config.defaultColor"
                                      :label="translate(field.label)"
                                      :step="field.step"
                                      :max="field.max"
                                      :min="field.min"
                                      :hide-details="field.hide_details"
                                      :placeholder="translate(field.placeholder)"
                                      :prepend-icon="field.prepend_icon"
                                      :append-icon="field.append_icon"
                                      :thumb-label="field.thumb_label"
                                      :thumb-size="field.thumb_size"
                                    >
                                      <template
                                        v-if="field.show_number"
                                        v-slot:append
                                      >
                                        <v-text-field
                                          v-model="field.value"
                                          class="mt-0 pt-0"
                                          hide-details
                                          :step="field.step"
                                          single-line
                                          type="number"
                                          style="width: 60px"
                                        />
                                      </template>
                                    </v-slider>
                                    <v-menu
                                      v-if="field.type === 'datePicker'"
                                      :key="index"
                                      v-model="field.show"
                                      :close-on-content-click="field.range ? false : true"
                                      :nudge-right="40"
                                      transition="scale-transition"
                                      offset-y
                                      min-width="290px"
                                      :color="field.color ? field.color : $config.defaultColor"
                                    >
                                      <template v-slot:activator="{ on }">
                                        <v-text-field
                                          :value="convertValue(field)"
                                          :label="translate(field.label)"
                                          prepend-icon="event"
                                          readonly
                                          v-on="on"
                                        />
                                      </template>
                                      <v-date-picker
                                        v-model="field.value"
                                        :type="field.month === true ? 'month' : 'date'"
                                        :range="field.range"
                                        no-title
                                        scrollable
                                        first-day-of-week="1"
                                        locale="ru-ru"
                                      />
                                    </v-menu>
                                    <v-layout
                                      v-if="field.type === 'select'"
                                      :key="index"
                                    >
                                      <v-select
                                        v-model="field.value"
                                        :color="$config.defaultColor"
                                        :items="field.items"
                                        :item-text="field.item_text"
                                        :item-value="field.item_value"
                                        :label="!field.label_tootlip ? translate(field.label) : ''"
                                        :multiple="field.multiple"
                                        :chips="field.chips"
                                        :disabled="getDisabled(field)"
                                        @change="changeEvent(field)"
                                      >
                                        <template
                                          v-if="field.label_tootlip"
                                          v-slot:prepend
                                        >
                                          <CrudTooltip :field="field" />
                                        </template>
                                      </v-select>
                                    </v-layout>
                                    <v-layout
                                      v-if="field.type == 'autocomplete'"
                                      :key="index"
                                    >
                                      <v-autocomplete
                                        v-model="field.value"
                                        :color="$config.defaultColor"
                                        :items="field.items"
                                        :item-text="field.item_text"
                                        :item-value="field.item_value"
                                        :label="!field.label_tootlip ? translate(field.label) : ''"
                                        :multiple="field.multiple"
                                        :chips="field.chips"
                                        :disabled="getDisabled(field)"
                                        :clearable="field.clearable"
                                        autocomplete="off"
                                        :deletable-chips="field.deletable_chips"
                                        :search-input.sync="field.search_input"
                                        @change="changeEvent(field)"
                                        @input="inputEvent(field)"
                                        @keyup="keyUpEvent(field)"
                                      >
                                        <template
                                          v-if="field.label_tootlip"
                                          v-slot:prepend
                                        >
                                          <CrudTooltip :field="field" />
                                        </template>
                                      </v-autocomplete>
                                    </v-layout>
                                    <v-layout
                                      v-if="field.type == 'checkbox'"
                                      :key="index"
                                    >
                                      <v-checkbox
                                        v-model="field.value"
                                        :color="field.color || $config.defaultColor"
                                        :label="translate(field.label)"
                                        :disabled="getDisabled(field)"
                                      />
                                    </v-layout>
                                    <v-layout
                                      v-if="field.type == 'switch'"
                                      :key="index"
                                    >
                                      <v-switch
                                        v-model="field.value"
                                        :color="field.color || $config.defaultColor"
                                        :label="!field.label_tootlip ? translate(field.label) : ''"
                                        :disabled="getDisabled(field)"
                                      >
                                        <template
                                          v-if="field.label_tootlip"
                                          v-slot:prepend
                                        >
                                          <CrudTooltip :field="field" />
                                        </template>
                                      </v-switch>
                                    </v-layout>
                                    <v-layout
                                      v-if="field.type == 'radio-group'"
                                      :key="index"
                                    >
                                      <v-radio-group
                                        v-model="field.value"
                                        :color="field.color || $config.defaultColor"
                                        :label="translate(field.label)"
                                        :items="field.items"
                                        :item-text="field.item_text"
                                        :item-value="field.item_value"
                                        :disabled="getDisabled(field)"
                                      >
                                        <v-radio />
                                        <v-radio />
                                      </v-radio-group>
                                    </v-layout>
                                    <v-layout
                                      v-if="field.type == 'select-color'"
                                      :key="index"
                                    >
                                      <v-select
                                        v-model="field.value"
                                        :color="field.value ? findColor(field.value,field.items) : $config.defaultColor"
                                        :items="field.value"
                                        :item-text="field.item_text"
                                        :item-value="field.item_value"
                                        :label="translate(field.label)"
                                        :multiple="field.multiple"
                                        :chips="field.chips"
                                      >
                                        <template
                                          slot="item"
                                          slot-scope="data"
                                        >
                                          <div
                                            :style="'background-color:' + data.item.text"
                                            class="v-select__color-picker"
                                          >
                                            {{ data.item.text }}
                                          </div>
                                        </template>
                                      </v-select>
                                      <div
                                        v-if="field.type == 'select-color' && field.value"
                                        class="ml-1"
                                      >
                                        <div
                                          :style="'background-color:' + findColor(field.value,field.items)"
                                          style="width: 50px;height: 50px;"
                                        />
                                      </div>
                                    </v-layout>
                                    <v-layout
                                      v-if="field.type == 'colorPicker'"
                                      :key="index"
                                      align-item-center
                                      column
                                      style="flex: 0 0 auto"
                                    >
                                      <div class="title">
                                        Выбор цвета
                                      </div>
                                      <v-color-picker
                                        v-model="field.value"
                                        hide-mode-switch
                                        mode="hexa"
                                      />
                                    </v-layout>

                                    <div
                                      v-if="field.after_text_copy"
                                      :key="`copytext-${index}`"
                                      class="caption mt-n5 mb-4"
                                    >
                                      {{ field.after_text_copy }}
                                      <v-tooltip
                                        v-if="false"
                                        bottom
                                      >
                                        <template v-slot:activator="{ on }">
                                          <v-btn
                                            icon
                                            x-small
                                            @click="copyText(field.after_text_copy)"
                                            v-on="on"
                                          >
                                            <v-icon x-small>
                                              mdi-content-copy
                                            </v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Скопировать</span>
                                      </v-tooltip>
                                    </div>


                                    <slot
                                      v-if="field.type === 'slot'"
                                      :name="`slot.${field.key}`"
                                      :items="createEditedItem()"
                                    />


                                    <slot
                                      v-if="field.key === 'after-form'"
                                      name="after-form"
                                      :items="createEditedItem()"
                                    />
                                  </template>


                                  <v-card-actions
                                    v-if="field.key === 'id' "
                                    :key="index"
                                    class="mt-2"
                                  >
                                    <v-layout justify-end>
                                      <v-btn
                                        color="red"
                                        class="white--text mr-2"
                                        @click="closeEditDialog"
                                      >
                                        {{ $t('crud.cancel') }}
                                      </v-btn>
                                      <template v-if="field.value > 0">
                                        <v-btn
                                          color="#37bc9b"
                                          class="white--text mr-2"
                                          :disabled="formSent"
                                          @click="sendUpdateForm({})"
                                        >
                                          {{ $t('crud.ok') }}
                                        </v-btn>
                                        <v-btn
                                          color="#37bc9b"
                                          class="white--text"
                                          :disabled="formSent"
                                          @click="sendUpdateForm({},false)"
                                        >
                                          {{ $t('crud.only_save') }}
                                        </v-btn>
                                      </template>
                                      <template v-else>
                                        <v-btn
                                          color="#37bc9b"
                                          class="white--text mr-2"
                                          @click="sendCreateForm({})"
                                        >
                                          {{ $t('crud.ok') }}
                                        </v-btn>
                                        <v-btn
                                          color="#37bc9b"
                                          class="white--text"
                                          @click="sendCreateForm({},false)"
                                        >
                                          {{ $t('crud.only_save') }}
                                        </v-btn>
                                      </template>
                                    </v-layout>
                                  </v-card-actions>
                                </slot>
                                <slot
                                  v-if="model.only_slot"
                                  :name="`form.${field.key}`"
                                  :field="field"
                                />
                              </template>
                            </template>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                    </v-tabs>
                  </div>
                </slot>
              </v-form>
            </v-card-text>
          </v-container>
        </v-card>
      </v-dialog>
    </template>
  </div>
</template>

<script>
  
  import ORM from '@/api/ORM';
  import Languages from "./Languages";
  import TipTap from "../TipTap/TipTap";
  import CrudTooltip from "./CrudTooltip";
  import SortMobile from "../page/SortMobile";
  import TcsmDialog from "../page/Dialogs/tcsmDialog";

  export default {
    name: "Crud",
    components: {
      TcsmDialog,
      SortMobile,
        CrudTooltip,
        TipTap,
      Languages,
    },
    props: {
      createButtonCallback: {
          type: [Boolean, Function],
          default: false,
      },
      hideCreateBtn: {
          type: Boolean,
          default: false,
      },
      editButtonCallback: {
          type: [Boolean, Function],
          default: false,
      },
      deleteButtonCallback: {
          type: [Boolean, Function],
          default: false,
      },
      dblClickCallback: {
          type: [Boolean, Function],
          default: false,
      },
      model: {
        type: Object,
        required: true
      },
      queryOptions: {
        type: Object,
        default: () => {
          return {};
        }
      },
      prependItemAttributes: {
        type: Object,
        default: () => {
          return {};
        }
      },
      appendItemAttributes: {
        type: Object,
        default: () => {
          return {};
        }
      },
      showExpand: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      expanded: {
        type: Array,
        default: () => {
          return [];
        }
      },
      singleExpand: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      footerProps: {
        type: Object,
        default: () => {
          return {
              'items-per-page-options': [5, 15, 25, 50],
              'items-per-page-text': 'Показывать',
          }
        }
      },
      showTitle: {
        type: Boolean,
        default: true
      },
      hideDefaultHeader: {
        type: Boolean,
        default: false
      },
      hideDefaultFooter: {
        type: Boolean,
        default: true
      },
      refresh: {
        type: Boolean,
        default: false
      },
      autoQuery: {
          type: Boolean,
          default: true
      },
      sortDesc: {
        type: Boolean,
        default: false,
      },
      sortByCustom: {
        type: [Object, String],
        default: ()=> {
          return null;
        }
      },
      showSort: {
        type: Boolean,
        default: true,
      },
      groupBy: {
        type: Boolean,
        default: false,
      },
      customItem: {
        type: Boolean,
        default: false,
      },
      customHeaders: {
        type: Array,
        default: () => {
          return [];
        },
      },
      mobileBreakpoint: {
        type: [String, Number],
        default: '600',
      },
      elevation: {
        type: String,
        default: '',
      },
      elementIdToGet: {
        type: [Number, String],
        default: null,
      },
      toSendOptions: {
        type: Object,
        default: () => {
          return {};
        },
      },
      pageOptions: {
        type: Object,
        default: () => {
          return null
        }
      },
      hideActions: {
        type: Boolean,
        default: false
      },
      itemClass: {
        type: [String, Function],
        default: () => {
          return '';
        }
      }
    },
    data: () => ({
      menu: false,
      editedItem: {},
      selected_page: 1,
      searchWatcher: "",
      dialogLoader: false,
      editDialog: false,
      search_timer: 0,
      form: [],
      files: [],
      onClose: true,
      loadingSearch: false,
      headers: [],
      loading: true,
      activeAction: true,
      selectItems: [],
      actionText: '',
      actionEdit: false,
      translateData: [],
      formSent: false,
      options: {
        itemsPerPage: 15,
        sortBy: [],
        sortDesc: [],
        fields: [],
      },
      sortBy: null,
      response: {
        items: [],
        meta: {
          page: 1,
          last_page: 0,
          per_page: 15,
          total: 0
        }
      },
      editedIndex: -1,
      langContent: [],
      clickCounter: 0,


      filesArray: {},
      modelTab: 0,
        tabs: [
            { title: 'Главная', key:'main' }
        ],
      isFirstLoad: true,
    }),
    computed: {
      refreshTable: {
        get() {
          return this.refresh;
        },
        set(v) {
          this.$emit('update:refresh', v);
        }
      },
      lastLoadedRow() {
        return (this.response.meta.page * this.response.meta.per_page < this.response.meta.total) ? (this.response.meta.page * this.response.meta.per_page) : this.response.meta.total;
      }
    },
    watch: {
      async refreshTable(v) {
        await this.refreshNow(v);
      },
      async options(pagination) {
        // console.log('options')
        this.initSearch(pagination.page);
        // const {data} = await this.paginate(pagination.page);
        // this.response = data;
      },
      async searchWatcher() {
        // console.log('searchwatcher')
        this.initSearch(this.selected_page, this.searchWatcher);
      },
      queryOptions: {
          handler(val) {
          if (!this.autoQuery) {
            return;
          }
          // console.log(val);
          this.selected_page = 1;
          this.initSearch(this.selected_page);
        },
        deep: true
      },
      'response.items': {
        handler(val) {
          if (!!val && !!this.elementIdToGet && this.isFirstLoad) {
            this.isFirstLoad = false;
            this.getElementById(this.elementIdToGet);
          }
        },
        deep: true,
      },
      element_id_to_get(val) {
        if (!!val) {
          this.getElementById(val);
        }
      },
      pageOptions: {
        handler(val) {
          if (!!val) {
            this.options = Object.assign(this.options, val);
          }
        },
        deep: true,
      }
    },
    async mounted() {
      this.activeAction =
        this.model.active_action === undefined
          ? true
          : false;

      this.getTableHeader();
      this.options.sortBy = _.isArray(this.model.table.sortBy)
        ? this.model.table.sortBy
        : [this.model.table.sortBy];
      this.options.fields = _.isArray(this.model.table.fields)
        ? this.model.table.fields
        : [this.model.table.fields];
      
      this.options.sortDesc = _.isArray(this.model.table.sortDesc)
        ? this.model.table.sortDesc
        : [this.model.table.sortDesc];

      let tabs = typeof this.model.form === "function"
          ? (await this.model.form()).tabs
          : this.model.form.tabs;

      if(tabs&&tabs.length){
        this.tabs = Object.assign([], tabs);
      }


      if (!!this.pageOptions) {
        this.options = Object.assign(this.options, this.pageOptions);
      }
    },
    methods: {
      async initSearch(page = 1, searchText = ""){
        clearTimeout(this.search_timer);
        this.loading = true;
        this.loadingSearch = true;
        this.search_timer = setTimeout(async () => {
          // console.log('initSearch')
          let {data} = await this.paginate(page, searchText);
          this.response = data;
          // console.log('response', data);
          this.loading = false;
          this.loadingSearch = false;
        }, 1000);
      },
      copyText(text){
          if (typeof(navigator.clipboard)=='undefined') {
              console.log('navigator.clipboard undefined');
              var textArea = document.createElement("textarea");
              textArea.value = text;
              textArea.style.position="fixed";  //avoid scrolling to bottom
              document.body.appendChild(textArea);
              textArea.focus();
              textArea.select();

              try {
                  var successful = document.execCommand('copy');
                  var msg = successful ? 'successful' : 'unsuccessful';
                  console.info(msg);
              } catch (err) {
                  console.warning('Was not possible to copy te text: ', err);
              }

              document.body.removeChild(textArea)
              return;
          }
          navigator.clipboard.writeText(text).then(function() {
              console.info(`successful!`);
          }, function(err) {
              console.warning('unsuccessful!', err);
          });
      },
      doNothing(){
          return false;
      },
      async refreshNow(v) {
        if (!v) {
          return;
        }
        // console.log('refreshnow')
        await this.initSearch(this.selected_page);
        // this.$store.commit('setSnackParams', {
        //   text: this.translate('messages.success'),
        //   color: 'success'
        // });
        this.$emit('update:refresh', false);
      },



      // async getItems(field) {
      //     return await [];
      //   //
      //   //   console.log("typeof field.items", field, typeof field.items);
      //   //
      //   // if (typeof field.items === 'function') {
      //   //   let awaitItems = await field.items(this.form);
      //   //   console.log("result await", typeof awaitItems, field, awaitItems);
      //   //   return awaitItems;
      //   // }
      //   //
      //   //
      //   // console.log("result await", typeof field.items );
      //   // return await field.items;
      // },

      changeEvent(field){
          if (!field.onChange || !_.isFunction(field.onChange)){
            return null;
          }

          return field.onChange(this.form, field);
      },
      inputEvent(field){
          if (!field.onInput || !_.isFunction(field.onInput)){
            return null;
          }

          return field.onInput(this.form, field);
      },
      keyUpEvent(field){
          if (!field.onKeyUp || !_.isFunction(field.onKeyUp)){
            return null;
          }

          return field.onKeyUp(this.form, field);
      },
      getDisabled(field) {

        if (typeof field.disabled === 'function') {
          return field.disabled(this.form);
        }
        return field.disabled
          && this.actionEdit;
      },
      convertValue(field){
          // селект может быть range, и возвращается массив, а надо текст
          if(_.isArray(field.value)){
              // может быть есть куда заполнять полученные значения
              if(field.fill_keys){
                  for ( var key in field.value ) {
                    let keyField = this.form.find((item) => item.key === field.fill_keys[key]);
                    if(keyField){
                      keyField.value = field.value[key];
                    }
                  }
              }

              return field.value.join(' - ');
          }
          return field.value;
      },

      checkDrawCondition(form, field) {
           // у каждого элемента в модели может быть condition, где можно прописать условие на отображение данного элемента
          if( _.isFunction(field.condition) ){
              let result = field.condition(form, field);
              return result;
          }
          // остальным разрешаем
          return true;
      },
      inputLanguageContent(content) {
        this.langContent = content;
      },
      translate(value) {
        return this.$te(value) ? this.$t(value) : value;
      },
      async getTranslate(id) {
        this.translateData = await this.model.methods.languages(id);
      },
      findColor(index, items) {
        let color = '';
        if (index !== '') {
          color = items.find(el => el.value == index).text;
        }
        return color;
      },
      createEditedItem() {
        let editedItem = {};
        for (let item of this.form) {
          let editKey = item.key;
          let editValue = item.value;
          
          editedItem[editKey] = editValue;
        }

        return editedItem;
      },
      
      async sendUpdateForm(items = {}, closeAfter = true) {
        
        let editedItem = items;
        
        if (!Object.keys(items).length) {
          editedItem = this.createEditedItem();
        }
        
        
        if (this.files.length > 0) {
          editedItem.files_ids = this.files.map(file => (file.id));
        }
        
        let id = editedItem.id;
        
        for (let key in editedItem) {
          if (editedItem[key] === undefined) {
            editedItem[key] = "";
          }
        }
        
        if (this.model.show.lang) {
          editedItem.langs = this.langContent;
        }
        this.formSent = true;
        let request_data = (await this.model.methods.update(id, editedItem)).data;
        this.formSent = false;
        if (!request_data.status) {
          
          let exception_text = 'messages.error';
          
          this.$store.commit('setSnackParams', {
            text: (this.translate(exception_text)),
            color: 'warning'
          });
          return false;
        }
        if(closeAfter) {
            this.onClose = false;
            this.closeEditDialog();
            await this.initSearch(this.selected_page);
            this.$store.commit('setSnackParams', {
                text: this.translate('messages.success'),
                color: 'success'
            });
        }
      },
      async sendCreateForm(items = [], closeAfter = true) {
        let editedItem = items;
        if (!Object.keys(items).length) {
          editedItem = this.createEditedItem();
        }

        editedItem = _.assign(editedItem, this.appendItemAttributes);
        editedItem = _.assign(editedItem, this.toSendOptions);

        if (this.files.length > 0) {
          editedItem.files_ids = this.files.map(file => (file.id));
        }
        
        if (this.model.show.lang) {
          editedItem.langs = this.langContent;
        }
        
        let request_data = (await this.model.methods.create(editedItem)).data;

          if(request_data.data && request_data.data.id){
              let idField = this.form.find((item) => item.key === 'id');
              idField.value = request_data.data.id;
          }

        if (!request_data.status) {
          
          let exception_text = 'messages.error';
          
          this.$store.commit('setSnackParams', {
            text: (this.translate(exception_text)),
            color: 'warning'
          });
          return false;
        }


        if(closeAfter) {
            await this.initSearch(this.selected_page);
            this.$store.commit('setSnackParams', {
                text: 'Применено успешно',
                color: 'success'
            });

            this.onClose = false;
            this.closeEditDialog();
        }
      },
      
      async createdFormFields(fields) {
          let editedItem = [];

          for (let field of fields.filter(field => (!field.hidden))) {
              let newField = Object.assign({}, field);
              editedItem.push(newField);
          }

          editedItem.push({
              key: 'id',
              value: ''
          });

          for(var key in this.prependItemAttributes) {
              var value = this.prependItemAttributes[key];

              let field = editedItem.find((item) => item.key === key);
              if(field) {
                  field.value = value;
              } else {
                  editedItem.push({
                      key: key,
                      value: value,
                  });
              }
          }

          for (let field of editedItem.filter(field => field.items)) {
              field.items = _.isFunction(field.items)
                  ? await field.items(editedItem)
                  : field.items;
          }

          return editedItem;
      },

      async createButtonEvent(){
        if( _.isFunction(this.createButtonCallback) ) {
            return this.createButtonCallback();
        }

        return this.showCreateDialog();
      },

      async editButtonEvent(item){
        if( _.isFunction(this.editButtonCallback) ) {
            return this.editButtonCallback(item);
        }

        return this.showEditDialog(item);
      },

      async deleteButtonEvent(item_id){
        if( _.isFunction(this.deleteButtonCallback) ) {
            return this.deleteButtonCallback(item_id);
        }

        return this.deleteMethod(item_id);
      },
      
      async showCreateDialog() {
        this.actionText = this.translate('global.create');
        this.actionEdit = false;
        
        this.dialogLoader = true;
        
        let fields = typeof this.model.form === "function"
          ? (await this.model.form()).fields
          : this.model.form.fields;
        
        this.form = await this.createdFormFields(fields);
        this.editDialog = true;
        this.dialogLoader = false;
      },
      // Подгружает таблицу
      async paginate(page = 1, searchString = "") {
        this.loading = true;
        let options = _.assign(this.options, {'q': searchString}, this.queryOptions);
        this.selected_page = page;
        options.page = page;
          // console.log('paginate',options)
        let {data} = await this.model.methods.paginate(options);
        this.loading = false;
        if (!data.status) {
          console.error("cant get index");
          return false;
        }
        return data;
      },
      async updatedFormFields(fields, item) {
          let editedItem = [];

          for (let field of fields.filter(field => (!field.hidden))) {

              let newField = Object.assign({}, field);
              if (item[newField.key]) {
                  newField.value = item[newField.key];
              }
              if (_.isFunction(field.value)) {
                  newField.value = field.value(item);
              }

              editedItem.push(newField);
          }

          editedItem.push({
              key: 'id',
              value: item.id
          });

          for (let field of editedItem.filter(field => field.items)) {
              field.items = _.isFunction(field.items)
                  ? await field.items(editedItem)
                  : field.items;
          }

          return editedItem;
      },
      
      async showEditDialog(item) {
        this.actionText = this.translate('global.edit');
        this.actionEdit = true;
        if (this.model.show.lang) {
          await this.getTranslate(item.id);
        }
        this.dialogLoader = true;
        this.editedIndex = this.response.items.indexOf(item);
        
        let fields = typeof this.model.form === "function"
          ? (await this.model.form()).fields
          : this.model.form.fields;
        
        this.form = await this.updatedFormFields(fields, item);

        this.editDialog = true;
        this.dialogLoader = false;
      },
      async clearFiles( field ) {
          if(field.multiple){
            field.value = field.value.filter(function(item){
                return item.id > 0;
            });
          } else {
              field.value = [];
          }
      },
      async changedFile( Files, field ) {
        if( typeof Files == 'undefined') return;
        if(false){
            return this.uploadFile(Files, field); // пока не работает :(((
        }




          if(Files) {
              for (let File of Files) {
                  let new_file = {};
                  new_file.imageName = File.name;
                  if(File.name.lastIndexOf('.') > 0) {
                      const fr = new FileReader();
                      fr.readAsDataURL(File);
                      fr.addEventListener('load', () => {
                          new_file.imageUrl = fr.result;
                          new_file.imageFile = File // this is an image file that can be sent to server...
                          if(field.multiple){
                            field.value.push(new_file);
                          } else {
                            field.value = new_file;
                          }
                      });
                  }
              }
          }

      },
      async uploadFile( Files, field ) {


        if( typeof Files == 'undefined') return;
          let formData = new FormData();

          if(Files) {
              for (let file of Files) {
                  formData.append("files", file);
              }
              formData.append("test", "foo bar");


          }

        try {

          let {data} = (await this.$api.Media.upload(formData)).data;
          // this.response.items[this.editedIndex].image = "";
          // this.closeEditDialog();
        } catch (e) {
          // console.log(e);
        }
      },
      async deleteFile(field, mediaId) {
        if (!confirm('Вы уверены что хотите удалить изображение ?' + mediaId)) {
          return false;
        }

        try {
            await this.$api.Media.delete(mediaId);
            if(field.multiple){
                field.value = field.value.filter(function(item){
                    return item.id != mediaId;
                });
            } else {
                field.value = [];
            }
            this.refreshNow(true);
        } catch (e) {
          console.log(e);
        }
      },
      closeEditDialog() {
        this.editDialog = false;
        this.translateData = [];
        this.files = [];
        if (!this.onClose) {
          return;
        }
        this.$emit('onCloseDialog', false);
      },
      getTableHeader() {
        let headers = [];

        headers = !this.model.table.headers
          ? this.model.table.fields.map(item => ({
            text: this.translate(item.label),
            value: item.key,
            ...item
          }))
          : this.model.table.headers;

        let existsAction = headers.find(el => el.value === "action");
        if (!existsAction && this.activeAction && !this.hideActions) {
          headers.push(this.createActions(headers));
        }
        
        return this.headers = headers;
      },
      clickRow(item){
        setTimeout(()=> {
            this.clickCounter = 0;
        }, 500);

        this.clickCounter++;

        if(this.clickCounter<2 && !this.$helpers.isMobile()){
            return;
        }
        // console.log('click')

        if( _.isFunction(this.dblClickCallback) ) {
            // console.log('is func')
            return this.dblClickCallback(item);
        }
            // console.log('out of func')

        this.$emit('clickRow', item);
        if (!this.model.show.edit) {
          return;
        }
        this.editButtonEvent(item);
      },
      createActions() {
        

        let existsShow = false;
        
        if (this.activeAction) {
          existsShow = true;
        }
        let actions = {};
        actions = existsShow ? {
            value: "action",
            text: this.$t('crud.actions'),
            sortable: false,
            width: '5%'
        } : actions;

        return actions;
      },
      
      // Удаляет
      async deleteMethod(id, item) {
        let index = this.response.items.indexOf(item);
        if (!confirm("Вы уверены что хотите удалить объект?")) {
          return false;
        }
        let {data} = await this.model.methods.delete(id);
        if (!data.status) {
          return false;
        }
        this.response.items.splice(index, 1);
        data = (await this.paginate(this.selected_page)).data;
        this.response = data;
        
        this.$store.commit('setSnackParams', {
          text: this.translate('messages.delete'),
          color: 'success'
        });
      },

      /**
       * Возвращает элемент по id из текущего списка, если таковой имеется
       * @param id - id элемента
       */
      getElementById(id) {
        let res = null;
        res = this.response.items.find((el) => {
          if (el.id == id) {
            return el;
          }
        });
        if (!!res) {
          this.$emit('open-dialog', res);
        }
      }
    },
  };

</script>

<style>
  .hide-v-messages .v-messages { display:none; }
</style>
