import { Spinner } from './spinner'

export function FullPageLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner className="size-8 text-primary" />
    </div>
  )
}
