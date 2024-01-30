'use client'

import "./page.scss";
import { Field } from "@/components/field";
import { Color, Role } from "@/types";
import { Pers } from "@/components/pers";

export default function Home() {
  return (
    <main className="main">
      <Field id='0007'>
        <Pers id='black_knight' color={Color.BLACK} role={Role.KNIGHT} cell={[2,4]} onClick={() => {}} />
      </Field>
    </main>
  );
}
