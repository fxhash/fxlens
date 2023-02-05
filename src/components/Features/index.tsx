import styles from "./Features.module.scss"

type Props = {
  features: any
}
export const Features = ({ features }: Props) => {
  return (
    <ul className={styles.featureList}>
      {features &&
        Object.entries(features).map(([key, value]: any, idx: any) => (
          <li key={idx}>
            <span>{key}</span>
            <span>{value.toString()}</span>
          </li>
        ))}
    </ul>
  )
}
