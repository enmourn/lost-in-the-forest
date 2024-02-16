export default class Alert {
  status: null | "about" | "intro" | "start" | "win" | "attempt1" | "attempt2" | "loss" = "about"
  color: { overlay: string; body: string }
  font: { color: string }

  constructor(config: { color: { overlay: string; body: string }; font: { color: string } }) {
    this.color = config.color
    this.font = config.font
  }

  render({ ctx, element }: { ctx: CanvasRenderingContext2D; element: HTMLCanvasElement }) {
    ctx.fillStyle = this.color.overlay
    ctx.fillRect(0, 0, element.width, element.height)
    ctx.fillStyle = this.color.body
    let text: string[] = []
    const alertW = 600
    const coord = { x: (element.width - alertW) / 2, y: 0 }

    if (this.status === "about") {
      const alertH = 310
      coord.y = (element.height - alertH) / 2
      ctx.fillRect(coord.x, coord.y, alertW, alertH)
      text = [
        "Каждый год только в российских лесах теряется свыше",
        "5 000 человек. 80% потерявшихся выживают, 13% находят",
        "погибшими, еще 7% считаются пропавшими без вести...",
        " ",
        "Lost In The Forest - симулятор, созданный, чтобы",
        "наглядно показать, что просиходит с человеком,",
        "заблудившимся в лесу. Надеемся в реальной жизни с",
        "вами этого никогда не произойдет!",
        "",
        "Нажмите ENTER чтобы продолжить",
      ]
    } else if (this.status === "intro") {
      const alertH = 360
      coord.y = (element.height - alertH) / 2
      ctx.fillRect(coord.x, coord.y, alertW, alertH)
      text = [
        "Все началось с того, что вы отправились за грибами,",
        "две недели стоятла прекрасная теплая погода и",
        "стоило вам только зайти в лес, как корзинка начала",
        "стремительно наполняться...",
        "",
        "Спустя час или полтора, вы решили, что грибов уже",
        "достаточно и пора возвращаться, но пройдя минут 20",
        "в обратном направлении, не оказались там, где ",
        "рассчитывали. Возникло непонимание куда идти.",
        "Похоже вы заблудились...",
        "",
        "Нажмите ENTER чтобы продолжить",
      ]
    } else if (this.status === "start") {
      const alertH = 210
      coord.y = (element.height - alertH) / 2
      ctx.fillRect(coord.x, coord.y, alertW, alertH)
      text = [
        "Используйте стрелки клавиатуры или клавиши A W S D",
        "для движения, клавишу G для отображения вашего",
        "местоположения. Следите за количеством ваших сил",
        "по шкале в правом нижнем углу экрана.",
        "",
        "Нажмите ENTER чтобы начать",
      ]
    } else if (this.status === "win") {
      const alertH = 210
      coord.y = (element.height - alertH) / 2
      ctx.fillRect(coord.x, coord.y, alertW, alertH)
      text = [
        "Обычная прогулка по лесу обернулась для вас",
        "настоящим приключением, но ваши навыки",
        "ориентирования вас не подвели!",
        "Поздавляю! Вы спаслись!",
        "",
        "Нажмите Enter чтобы попробовать еще раз",
      ]
    } else if (this.status === "attempt1") {
      const alertH = 290
      coord.y = (element.height - alertH) / 2
      ctx.fillRect(coord.x, coord.y, alertW, alertH)
      text = [
        "Ситуация развернулась не самым лучшим образом, вы",
        "потратили немало сил и вам захотелось ненадолго",
        "остановиться и отдохнуть... Спустя 15 минут вы",
        "почувствовали, что начинаете замерзать... Погода уже",
        "не казалась такой солнечной и теплый шерстяной",
        "свитер оставленный дома вам бы сейчас очень",
        "пригодился... Чтобы не замерзнуть - нужно двигаться!",
        "",
        "Нажмите Enter чтобы продолжить",
      ]
    } else if (this.status === "attempt2") {
      const alertH = 290
      coord.y = (element.height - alertH) / 2
      ctx.fillRect(coord.x, coord.y, alertW, alertH)
      text = [
        "Вы крайне сильно замерзли и очень сильно устали...",
        "Начавшийся дождь сперва не вызывал никаких",
        "опасений, но спустя некоторое время штаны, куртка",
        "и сапоги промокли насквозь. Ноги начали замерзать",
        "даже во время движения. Вам захотелось согреться",
        "возле костера, но спичек или зажигалки у вас с собой,",
        "не оказалось...",
        "",
        "Нажмите Enter чтобы продолжить",
      ]
    } else if (this.status === "loss") {
      const alertH = 250
      coord.y = (element.height - alertH) / 2
      ctx.fillRect(coord.x, coord.y, alertW, alertH)
      text = [
        "Дождь закончился. На прояснившемся небе засияли",
        "звезды. Уже стемнело и они казались ослепляюще",
        "яркими, будто согревающими вас своим светом...",
        "Сил больше не было, только желание закрыть глаза",
        "и оказаться дома... К сожалению вы не выжили...",
        "",
        "Нажмите Enter чтобы попробовать еще раз",
      ]
    }
    ctx.fillStyle = this.font.color
    ctx.font = `20px arial`
    text.forEach((line, index) => ctx.fillText(line, coord.x + 30, coord.y + 50 + index * 25))
  }
}
