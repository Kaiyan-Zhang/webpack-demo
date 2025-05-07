import React, { FC } from "react";
import { Button } from "@douyinfe/semi-ui";
import style from "./index.module.scss";

export const App: FC = () => {
  return <Button className={style["foo"]}>hello, world!</Button>;
};
