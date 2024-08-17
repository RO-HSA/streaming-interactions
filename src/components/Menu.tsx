import { menuItems } from "@/config/menuItems"
import { useMenu, type navigationType } from "@/hooks/useMenu"
import { i18n } from "@/lib/utils"

import * as style from "./Menu.module.css"

const Menu = () => {
  const { navigation, setNavigation } = useMenu()

  return (
    <div className={style.wrapper}>
      <h2 className={style.title}>{i18n("settings")}</h2>
      <div className={style.menuItems}>
        {menuItems.map(({ nav, title, icon: Icon }, index) => (
          <button
            className={[
              style.itemBtn,
              navigation === nav ? style.selected : ""
            ].join(" ")}
            onClick={() => setNavigation(nav as navigationType)}
            key={index}>
            <Icon size={28} />
            <span>{title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Menu
