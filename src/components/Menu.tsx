import { menuItems } from "@/config/menuItems"
import { useState } from "react"

import * as style from "./Menu.module.css"

const Menu = () => {
  const [selectedItem, setSelectedItem] = useState(0)

  return (
    <div className={style.wrapper}>
      <h2 className={style.title}>Settings</h2>
      <div className={style.menuItems}>
        {menuItems.map(({ title, icon: Icon }, index) => (
          <button
            className={[
              style.item,
              selectedItem === index ? style.selected : ""
            ].join(" ")}
            onClick={() => setSelectedItem(index)}
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
