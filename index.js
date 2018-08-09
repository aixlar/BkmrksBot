const Telegraf     = require('telegraf')
const session      = require('telegraf/session')
const Markup       = require('telegraf/markup')
const WizardScene  = require('telegraf/scenes/wizard')
const Stage        = require('telegraf/stage')
const postBookmark = require('./api')

const { leave }    = Stage

require('dotenv').config()

let template_bookmark = {
    'tag'   : '',
    'URL'   : '',
    'title' : '',
}

const add_bookmark = new WizardScene(
    'add_bookmark',
    (ctx, next) => {
        ctx.reply('Select bookmark tag', Markup
                                               .keyboard(['edu', 'other'])
                                               .oneTime()
                                               .resize()
                                               .extra()
        )
        return ctx.wizard.next()
    },
    (ctx) => {
        template_bookmark['tag'] = ctx.update.message.text
        ctx.reply('Enter bookmark URL')
        return ctx.wizard.next()
    },
    (ctx) => {
        template_bookmark['URL'] = ctx.update.message.text
        ctx.reply('Enter bookmark title (for cases where an item does not have a title like PDF URLs)')
        return ctx.wizard.next()
    },
    (ctx) => {
        template_bookmark['title'] = ctx.update.message.text
        postBookmark(template_bookmark)
        ctx.reply('Done!')
        return ctx.scene.leave()
    }
)

const stage = new Stage()
stage.command('cancel', leave())
stage.register(add_bookmark)

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.use(session())
bot.use(stage.middleware())
bot.command('add', (ctx) => ctx.scene.enter('add_bookmark'))
bot.startPolling()