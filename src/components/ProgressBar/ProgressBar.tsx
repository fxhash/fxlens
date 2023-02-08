import classes from "./Progress.module.scss"

interface ProgressBarProps {
  progress: number
  max: number
}

interface NumberProps {
  value: number
}

function Number(props: NumberProps) {
  return <>{props.value.toLocaleString()}</>
}

export function ProgressBar(props: ProgressBarProps) {
  const { progress, max } = props
  return (
    <div className={classes.progress}>
      <span>
        <Number value={progress} /> of <Number value={max} /> bytes used
      </span>
      <div className={classes.barWrapper}>
        <div
          className={classes.bar}
          style={{ width: `${(100 / max) * progress}%` }}
        />
      </div>
    </div>
  )
}
