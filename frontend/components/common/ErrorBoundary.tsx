import { Button } from "@mui/material";
import React from "react";
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
    constructor(props: React.PropsWithChildren<{}>) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', flexDirection: 'column' }}>
                    <h1>Something unexpected happened please reload the page</h1>
                    <div>
                        <Button
                            onClick={this.handleReload}
                            variant="outlined"
                            color="secondary"
                            startIcon={<RefreshIcon fontSize='medium' />}
                            sx={{ textTransform: 'none', fontSize: '16px' }}>
                            Refresh
                        </Button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;