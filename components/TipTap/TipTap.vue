<template>
  <div>
    <div
      v-if="editor"
      class="tiptap editor"
      :class="[{'hideable':autoHide}]"
      :style="computedStyle"
    >
      <editor-menu-bar
        v-slot="{ focused, commands, isActive }"
        :editor="editor"
        class="pa-1"
      >
        <div
          v-if="!disabled"
          class="menubar"
          :class="[{'is-hidden':autoHide},{ 'is-focused': focused }]"
        >
          <div class="menubar">
            <v-btn
              text
              min-width="0"
              class="menubar__button px-0"
              :class="{ 'is-active': isActive.bold() }"
              @click="commands.bold"
            >
              <v-icon>mdi-format-bold</v-icon>
            </v-btn>

            <v-btn
              text
              min-width="0"
              class="menubar__button px-0"
              :class="{ 'is-active': isActive.italic() }"
              @click="commands.italic"
            >
              <v-icon>mdi-format-italic</v-icon>
            </v-btn>

            <v-btn
              text
              min-width="0"
              class="menubar__button px-0"
              :class="{ 'is-active': isActive.strike() }"
              @click="commands.strike"
            >
              <v-icon>mdi-format-strikethrough</v-icon>
            </v-btn>

            <v-btn
              text
              min-width="0"
              class="menubar__button px-0"
              :class="{ 'is-active': isActive.underline() }"
              @click="commands.underline"
            >
              <v-icon>mdi-format-underline</v-icon>
            </v-btn>

            <v-btn
              text
              min-width="0"
              class="menubar__button px-0"
              :class="{ 'is-active': isActive.code() }"
              @click="commands.code"
            >
              <v-icon>mdi-format-color-highlight</v-icon>
            </v-btn>

            <v-btn
              text
              min-width="0"
              class="menubar__button px-0"
              :class="{ 'is-active': isActive.paragraph() }"
              @click="commands.paragraph"
            >
              <v-icon>mdi-format-section</v-icon>
            </v-btn>

            <v-btn
              text
              min-width="0"
              class="menubar__button px-0"
              :class="{ 'is-active': isActive.heading({ level: 1 }) }"
              @click="commands.heading({ level: 1 })"
            >
              <v-icon>mdi-format-header-1</v-icon>
            </v-btn>

            <v-btn
              text
              min-width="0"
              class="menubar__button px-0"
              :class="{ 'is-active': isActive.heading({ level: 2 }) }"
              @click="commands.heading({ level: 2 })"
            >
              <v-icon>mdi-format-header-2</v-icon>
            </v-btn>

            <v-btn
              text
              min-width="0"
              class="menubar__button px-0"
              :class="{ 'is-active': isActive.heading({ level: 3 }) }"
              @click="commands.heading({ level: 3 })"
            >
              <v-icon>mdi-format-header-3</v-icon>
            </v-btn>

            <v-btn
              text
              min-width="0"
              class="menubar__button px-0"
              :class="{ 'is-active': isActive.bullet_list() }"
              @click="commands.bullet_list"
            >
              <v-icon>mdi-format-list-numbered</v-icon>
            </v-btn>

            <v-btn
              text
              min-width="0"
              class="menubar__button px-0"
              :class="{ 'is-active': isActive.ordered_list() }"
              @click="commands.ordered_list"
            >
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-btn>

            <v-btn
              text
              min-width="0"
              class="menubar__button px-0"
              :class="{ 'is-active': isActive.blockquote() }"
              @click="commands.blockquote"
            >
              <v-icon>mdi-format-quote-close</v-icon>
            </v-btn>

            <v-btn
              text
              min-width="0"
              class="menubar__button px-0"
              :class="{ 'is-active': isActive.code_block() }"
              @click="commands.code_block"
            >
              <v-icon>mdi-code-tags</v-icon>
            </v-btn>

            <v-btn
              text
              min-width="0"
              class="menubar__button px-0"
              @click="commands.horizontal_rule"
            >
              <v-icon>mdi-format-page-break</v-icon>
            </v-btn>

            <v-btn
              text
              min-width="0"
              class="menubar__button px-0"
              @click="commands.undo"
            >
              <v-icon>mdi-undo</v-icon>
            </v-btn>

            <v-btn
              text
              min-width="0"
              class="menubar__button px-0"
              @click="commands.redo"
            >
              <v-icon>mdi-redo</v-icon>
            </v-btn>
          </div>
        </div>
      </editor-menu-bar>

      <editor-menu-bubble
        v-if="!disabled"
        v-slot="{ commands, isActive, getMarkAttrs, menu }"
        class="menububble"
        :editor="editor"
        @hide="hideLinkMenu"
      >
        <div
          class="menububble"
          :class="{ 'is-active': menu.isActive }"
          :style="`left: ${menu.left}px; bottom: ${Math.max(0,menu.bottom-70)}px;`"
        >
          <form
            v-if="linkMenuIsActive"
            class="menububble__form"
            @submit.prevent="setLinkUrl(commands.link, linkUrl)"
          >
            <input
              ref="linkInput"
              v-model="linkUrl"
              class="menububble__input subtitle-2 font-weight-medium"
              type="text"
              placeholder="https://"
              @keydown.esc="hideLinkMenu"
            >
            <button
              class="menububble__button"
              type="button"
              @click="setLinkUrl(commands.link, null)"
            >
              <v-icon dark>
                mdi-link-off
              </v-icon>
            </button>
          </form>

          <template v-else>
            <button
              class="menububble__button"
              :class="{ 'is-active': isActive.link() }"
              @click="showLinkMenu(getMarkAttrs('link'))"
            >
              <span>{{ isActive.link() ? 'Update Link' : 'Add Link' }}</span>
              <v-icon dark>
                link
              </v-icon>
            </button>
          </template>
        </div>
      </editor-menu-bubble>
      
      <editor-content
        class="editor__content"
        :editor="editor"
      />
    </div>
  </div>
</template>

<script>
    // Import the basic building blocks
    import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble  } from 'tiptap'
    import {
        Blockquote,
        CodeBlock,
        HardBreak,
        Heading,
        HorizontalRule,
        OrderedList,
        BulletList,
        ListItem,
        TodoItem,
        TodoList,
        Bold,
        Code,
        Italic,
        Link,
        Strike,
        Underline,
        History,
        Placeholder,
    } from 'tiptap-extensions'

    export default {
        name: "TipTap",
        components: {
            EditorContent,
            EditorMenuBar,
            EditorMenuBubble,
        },
        props: {
            value: {
                type: String,
                default: () => {
                    return '';
                }
            },
            maxWidth: {
                type: [String, Boolean],
                default: () => {
                    return false;
                }
            },
            autoHide: {
                type: Boolean,
                default: () => {
                    return false;
                }
            },
            disabled: {
                type: Boolean,
                default: () => {
                    return false;
                }
            }
        },
        data() {
            return {
                defaultColor: '#1BBEC3',
                // Create an `Editor` instance with some default content. The editor is
                // then passed to the `EditorContent` component as a `prop`
                editor: false,
                editable: false,
                linkUrl: null,
                linkMenuIsActive: false,
            }
        },
        computed: {
            computedStyle() {
                let styles = {};
                if(this.maxWidth){
                    styles.maxWidth = this.maxWidth + 'px';
                }

                return styles;
            },
            // syncValue: {
            //     get() {
            //         return this.value;
            //     },
            //     set(new_value) {
            //         this.$emit('update:value', new_value);
            //         // this.$emit('change', new_value);
            //     }
            // }
        },
        watch: {
            disabled(newValue) {
                this.editor.setOptions({
                    editable: !newValue,
                })
            },
            // value(newValue) {
            //     this.editor.setContent(newValue);
            // }
        },
        mounted() {
            this.init();
        },
        beforeDestroy() {
            // Always destroy your editor instance when it's no longer needed
            if(this.editor){
                this.editor.destroy();
            }
        },
        methods: {
            init(){
                if(!process.browser) return;
                //
                this.editor = new Editor({
                    editable: !this.disabled,
                    extensions: [
                        new Blockquote(),
                        new BulletList(),
                        new CodeBlock(),
                        new HardBreak(),
                        new Heading({ levels: [1, 2, 3] }),
                        new HorizontalRule(),
                        new ListItem(),
                        new OrderedList(),
                        new TodoItem(),
                        new TodoList(),
                        new Link(),
                        new Bold(),
                        new Code(),
                        new Italic(),
                        new Strike(),
                        new Underline(),
                        new History(),
                        new Placeholder({
                            emptyEditorClass: 'is-editor-empty',
                            emptyNodeClass: 'is-empty',
                            emptyNodeText: 'Напишите здесь что-нибудь …',
                            showOnlyWhenEditable: true,
                            showOnlyCurrent: true,
                        }),
                    ],
                    // content: this.syncValue,
                    // onUpdate: ({ getHTML }) => {
                    //     this.syncValue = getHTML();
                    // },
                    content: this.value,
                    onUpdate: ({ getHTML }) => {
                        this.$emit('update:value', getHTML());
                        this.$emit('change', getHTML());
                    },
                });

            },
            showLinkMenu(attrs) {
                this.linkUrl = attrs.href;
                this.linkMenuIsActive = true;
                this.$nextTick(() => {
                    this.$refs.linkInput.focus()
                })
            },
            hideLinkMenu() {
                this.linkUrl = null;
                this.linkMenuIsActive = false
            },
            setLinkUrl(command, url) {
                command({ href: url });
                this.hideLinkMenu()
            },

            //
            // clearContent() {
            //     this.editor.clearContent(true);
            //     this.editor.focus()
            // },
            //
            // setContent() {
            //     // you can pass a json document
            //     this.editor.setContent({
            //         type: 'doc',
            //         content: [{
            //             type: 'paragraph',
            //             content: [
            //                 {
            //                     type: 'text',
            //                     text: 'This is some inserted text. 👋',
            //                 },
            //             ],
            //         }],
            //     }, true);
            //     // HTML string is also supported
            //     // this.editor.setContent('<p>This is some inserted text. 👋</p>')
            //     this.editor.focus()
            // },
        },
    }
</script>

<style>

</style>

<style lang="scss">
  .editor p.is-editor-empty:first-child::before {
    content: attr(data-empty-text);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
    font-style: italic;
  }
</style>