import { ApplicationFunctionOptions } from 'probot'

const useRouter = (getRouter: ApplicationFunctionOptions['getRouter']) => {
  if (typeof getRouter === 'function') {
    getRouter().get('/health', (_req, res) => {
      res.status(200).json({ status: 'alive' })
    })
  }
}

export default useRouter
