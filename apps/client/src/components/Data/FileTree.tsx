import { Path } from '@/services'

type FileTreeProps = {
  currentTree: Path[]
  setCurrentTree: (tree: Path[]) => void
}

const FileTree: React.FC<FileTreeProps> = ({ currentTree, setCurrentTree }) => {
  return (
    <div>
      {currentTree.map((path, index) => {
        if (path.type === 'directory') {
          return (
            <div key={index}>
              <span>{path.name}</span>
              <FileTree
                currentTree={currentTree}
                setCurrentTree={setCurrentTree}
              />
            </div>
          )
        }

        return <p key={index}>{path.name}</p>
      })}
    </div>
  )
}

export default FileTree
