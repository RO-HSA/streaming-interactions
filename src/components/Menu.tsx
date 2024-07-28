import { menuItems } from "@/config/menuItems"
import { useState } from "react"

import * as style from "./Menu.module.css"

const Menu = () => {
  const [selectedItem, setSelectedItem] = useState(0)

  return (
    <div className={style.wrapper}>
      <h2 className={style.title}>Settings</h2>
      <div className={style.menuItems}>
        {menuItems.map(({ href, title, icon: Icon }, index) => (
          <button
            className={[
              style.itemBtn,
              selectedItem === index ? style.selected : ""
            ].join(" ")}
            onClick={() => setSelectedItem(index)}
            key={index}>
            <a
              href={href}
              className={[
                style.itemLink,
                selectedItem === index ? style.selected : ""
              ].join(" ")}>
              <Icon size={28} />
              <span>{title}</span>
            </a>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Menu
