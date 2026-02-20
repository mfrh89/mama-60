import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D/WebGL Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-cream/50">
          <div className="text-center px-4">
            <p className="font-serif text-lg text-charcoal/60 mb-2">
              3D-Darstellung nicht verfügbar
            </p>
            <p className="font-sans text-sm text-charcoal/40">
              Bitte überprüfe deine Browser-Einstellungen für WebGL.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
