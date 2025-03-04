const { axiosRequest } = require('./axios.request');

const browserIdentifier = '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"';
const userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36';

//create fc-token for otp verify step
const createFCToken = async () => {
    try {
        let data =
            'bda=eyJjdCI6InNPSEV6NXB4QjhqMUNDcW1PREdGR0xIZ1VSaC9SamF2bFp2WkQ0d1NDcnB6RFA1ZnZKZU9FYU5tNWVmcWowRDAvby8rMWxic3A3K1NFMXkyNTdlckY5VDlraVAyZmxwdzF5RUZUZkhlcmRZcWVubUdka2F4bUJRbUF3WjZ6SjE3cUpBVVozYThaSGdLVUJQbXhxdHlJdGM0MDhDNG50U2YzMDQ2aDJMRm8vbkZ5T2F4WXg4UklVWGUvQUNSWVhSSm5nVGdDS2dsMnlNVzlUOU9QTld5dkNXTGkvOVVzSmdjd0NSSW1GM2xPQlJmb2VnTTk2MTAyWjVRQWR2V0hkcUNJMTc3bGU1aGNnR0tUV0hSemlzeHJ6OEJCajFXTEl2MWNIdEZwc1p3QVl5VE5ZL1A1ak9KbWdBa2RiMi9Nc3FwaFNtdW8vNDVsN2tUWVYzQk9hU203Y3hvYkdWYWdNMlZVb2pCWVJIdlAvVStzQlg0NXFHdGthbEhXdTJuUDlSR052UStoeG9zSFNjLzhKK2Yya3Z1d2szZXQrTjlFUjJrSEtxZFFkUVQvd0FGMmRwaVR1MTdRMmtKMC9SdWhuUHpGd1Zrc0RNcXVsQzJuL2dPblhodFBFSUVOcGxJcGZNcldYYTUxSWd6aWVRVDdEQnQzcDAwTTVxOFFOc0RPamh2amZ1UU1oaGIyZ2dHVHV2SU9vS1VXVXBFd3pLb3M4Vy9XZkNNOU1WQXhEVHloeUNTMlBYTTFWUjl3RDZGU2EyV3VBOThOcUQ2MmZOb3F1cHBWcEMyT3g5RHFORWtjYmsveUR5eGtwRy9rQUNjbm1Eak0yT2pSTWFSQWdaOXN3UjVJZ21mOVNZYXYzZ2dacFJCR1lHZk9ya3lsVGg4WGFUYVA0bEZFNTVWc2dJRWw2b011bWdnN0Q1YVRiU2ExNEI4cG54K285d256RExvc01XTFM5emVLRmFJUXkxOGFYYkdGd3AxaHZJbHVNbzZ0OXhDZjlpZUlkenFibmp0NFlDKzlGcHd5Rlo1YlNUYnZEVzRiOHQwUXc5VTRzb29Lb0xMM3NQaS9aSlh0cnpNMmRDUytVcmNRV1d1UDB6UUhhYkZsMFpGK0d6eTlydWxGaXdQdzJLRUZEUE9zUjVEaW5PYmRaOUd4VGxmM0NOMWtGRHNQOUhydjRYbmt0WW9QcWFrMkRUZjR4UG5tZ3RjNlRjamVzTmhWbkRZWklPSUk0R3hhc1VkdjEyRjArMWI4enY3OXFMNnRUL3ZLc25XOGI4d0l0TG9hQ2FNbFl2V3ZxdWE4bGhadWc2ZU5aMEtWOGFwd3ZCNVJoM0ZISnVra2lBR3lpdSsrY1ppWnQyd0hXNGE0V1llK2RhWHVTa3Y5OEhFV2s5TG1vYklUeS8wSThiMXVKVGswb2p0dDMrTjdRY2pwcUZvVzlkbGZ0elVYczhsMTNlU3JadTcwUGZtckJyWnAvZFNxdEdHbXNraitxTDMzaUF2K1JMV25pMEpoYXRwdDM2RUJ4MzRHTG5oTlpBRndXWHNXbnJmblloK0hKU1hXN2RqU3N0L2x2Nnc1b3FOUUh1TTlPVGxPTmFoU2FFWHlkQVE2Rjd4d2NLSENmd01SN3JpK0hvci9JOFg3V0EvZ3pWcEJZK2xzMDFVUUxmdm9peHBMclhlZHpyQzR6QWdjeTZLamZPVmh4NjZoMGNlOU1qZlY4a1BoOHY3V0tUQksrNWxGczZQZjZ2UUIwTktIR2xjN0VBekxLUHNTaDdObmd6WExzazZDZ0NHZGJkTC9oWGJ5d2lNRVVMTjVOSWZtRjJEOExYanV0RUZvSEFVR1VqamFaOGcxdm1CYWtISTNhRDJFbll6dExVQnZsTkFJQkRka1BaVDJaTnQ2ZkRkYkdncXhFTUh2bnRqRjN0Y0h1N0VKUFVSY0RuTlJKUDVsanNsTTlLdUNDZC9SQnJzVkZZclA3VCtvcUJrSG9xSkE3QjVtMWN1bjlQQmRDL3FPbkJ5cEtwM0hnaytKbm15dmR3Z2xNYkpsUjRIbUErTSszRTBuUEJ0K0I0MjRxWEpjYklvT0lITDViZ0VPbVJudEtJVGdKdlR5WXJlSjhwdmM5RXY4bDJvVUk4aW1pemFWcU1zOXcva0JjckJaTUxhY3ZtdllMaEE2ZnR0NUUzOENHVXJTaWc1T0RkNWpEaDJHZjBhSlBQMnVBeEFhbG5YdzdyMFZaZzh4YkNnQkt0Q2JyTGhVQzI2L3FTRmtxTWExeVlWTGF2MTZHUUg0OXUxZ1NuU01KaXEzbnRMUzlTbGQyVWNzQVcrWDJhSTdXZ3hrY3ZXbncwWEVPWndYelNwQUVYQWJ6cjBjM1pSbGtkMStkcWh3dld3dnBrZi8rbTFrR1loMUNNZFdHOCtQOEt5U1o0WUwzVVpLSHpNSTgxT1hmUEU5RmdVTmVreUtkdDNoZkc1UmZ6bjJDTWtpdVgxQW5pekkydCtWNUxZLzRmaEhkcTdxb2tBNW15WmgyY01nQ1o0b1NVWWF3WDIvMlU0TVBJVnQ3VlZxaVhsM0NwVlJaVVAybnBUUzU0cTArK1BLdmhyRFphSnRTcy8veTkrQzVETWMzUVJweGNOenBHRklvNktjYk14bmZBWURKZHFKNEFHQy9JZkxDUzNQajlBZGNkZ2VrNFpiRjFOQXEvcWo2ZnpXWm5YZjFFZUpENGdmUzNzMFV4bWxpNHp1MHhqK0tUUUZiWlI5UmVvdThJY3dJdGwrWVd0Y25kSUhqQnk2eG5NMXBnQWw0bHFNQnI3STh3UHc5bHZ0M3ZRNUNzaHMzc04yNHNiUkhDNmxKY2hOTEpaelhxQkFRV2xoYjJWL0E1RWhJcVBNYXpTOE85eXBKbm12Qyt6TXArc3hOeGdlbmV1b2Y2YWZFdUF3b0lDQm5STzdFeUE5NXFhUW81QnRGd29FM3pXTVFidTFoNGI4Mzd2ZjhIdUg0cm93RHNJcWwxanRHS2V1WXZIN2ZrOWc2cE5PTzFFSlQ4dDVmTjRTa0FlSW1ERUQ1aXgrT09iWUpwMVROMjd1VUlKZk1LQXNlbi9vQTdKMkQ1c21CVGpFVmpGRGhhM0ljQkxpTGh2U0tFdTJkWnRzOFI0Mmx5ZWRuekx0UTZyT3pQbDlFVWZ3Z1g2RSt1QTVqWlFKV3F1RHNVaHdsUnYxd1UvcVdWQlNTSVMybys5VGswV29GcmFQQjNadGlhVEtQVjJBbmFQK0lGanVLdVJ2NFJ0OEpZVkZLNncwZmNrek9JMUxHUVNPQWJVTmxNN1V4SlZJbUJ3em0xVVhUREdnYWt6MEc5ck9LdVRaSUNxYWZaZ3I3cmxnM3ZhTnh3NFhsT3MwOXVFUDd2bXAzdG41ZlRwai91YmhoQ0VaQVpJWXlEenpLNm0vUVpaUDdWQWo0MUtMcUFjdXUxYkozZy9odXU1TDB5RTA3VG9VNkxVZm5QMEVzUm5oOUNtaUNCZGhYTk1IUVpxV2VOWWswVXFwWWpYTkEzSGNTeGFJNFl2NUlTWlZrTHBPZDRBUG9sOHNUWERHTXZmVTNBRGJsbWxuakpKclBvMnc2SFAvV0FRSXFBMU1telI1UDl6RjRBSElVak9mU0VIcVBvOWFKMHpJbXlISWRIYXVpd0FseTJOcUhhcXRlY3Q2WWVKY0phaTk1VkxleHIyekRBaE95cGcwK2QrZTgrMDV2NW5mcUtUYk5vOVdKWjA5NXFYU3lDaWcvR0liQStxK2RxTEEyOUIwQTZIRlBES1NVYVI2bktSWUszQW5icHdQNFQ5MXNPTy90Vjh4OGR4dUtOdGhWY0hxMmNOVWRaeVFqUFNud1Z2V21CaTJTTHF4UnhQQ0VKVUJ5Z040bU9jKzFNSVdrcWhPRmRRR0lLUElIbUZDV1FqRWVNdFBhUHVESHR6dUpGMUx0T1hFWXJMN3VITFFPOWR6RWI0ZjRVM3c0aVR2OFBHdkVmN1ZwbXdST1gxZTFjV3JIVXkzODlBUjNqcUFYTTdPbmppdDUwemdsMTQrSEE4UzNzemR6L1p3WTdHc2xZK0N3b2xGSXRaQXZOOHQ3amc5cmJVelNNWEllRFhMZDhuSmQwTHZ1SXo1VStMOXN5anE3OXl6bUwwSjczT3VWOGJRRVVUKzg1MzlacnFKMEZibVJMOHFOU0wwbnpKK0l2b0FrNmZBR24zZ1MyV1FwTU05RVlQTkxLUzlkektZVzZGcGxGa0I3anhpeC8xU3A3M01BdVgzQ0VBVFFQejdORFNuWEh0TklqYTdXUHNmbm1VQ3U3Q3RNR1VKREFSQy9mUzZjV2tMVmdJWkRIcXdTY01yRHlZWEFtc0RkalhjYUJRWHBPNTlSWFBDVlVIbjlVYVFaVXlNMkkyNXlnQ1VUYk5ScmZwRGIySWp1RkRtKzZPNjdlY0dHS0lTOE5hR0R4S0xqay8zdzg0aHV5RUVIVDlmZzlRYnd5WGFXZEpRbWNkaC82NmgzOFJDTXBIQXMxd0cwSXNQM0Mrd2J0YnJxd2o2aW85bU82WG1lSFVRYTkvR1FHamhBU05sTklXcGxZbk9ZVk0rVFdmN2ZmZ3d3bVYxT2lsbmRlMCsyREp6anVxanJJdFF0SHdIM01LQit4QUR3SnhYdU54UjNMdXo1c1hVam5uTm5XSGVvZVdWZ01DTXBkb3dkVVpZSWN4VjQ5TFluTEM5c0EwMjF5MzJNblV3c2JSOU5RQ244dWtHY3V2dkN6cy9tVHpmSlVSYU9OZWttVkVnUHFhdUtRMjZMbVpRZ0hqSXdTYUxKNXkwWmxMam5MTUF2dGt0RVFmN1VlMmU0eXhNVG9lVUNGUXFtVCtuUTlKSDdWWUR5dUhSS0tGVkdZZDkzMXFZYTFmVWhRTVFidnQ2cGxKZHdnRWM1Z21kandMd3BNRnFsUk96UWlnOGlVSkh1VlhLenAyYXV3ejVJV0xkdjhtZEZKZThyMHVhZkNEcUFWZHpQS2JrZWVkK0lqZXdzWGlKK1lGTVV3eFBjYk1hNnA4S1pxM25xRkhMZTNMM2VJRk81OGM4VGpFS2VuaVNMWmtSUmcvejZjMzdHRTNBMVRnZlZyZFVlWFlLZHdjQ2RZVkV2Y0NXajBaQS83cVY1ZmwwZkYzc3JTNmh0enZRdEJpSEhEOU5aUmF5Rk1hN2UvdWxwZW9aaGhTR1RYZ0k0TjdvM21MbkRnaytYTUdYWUZKUXd0bkdlUVlTUUlONFkyeXF2aDUzcUc2dkw3cXNPbDFBbEhzeVBRUFUyM3lRc0NGeUdjQ1k0ZlA0c1JaZ2ZUaFdJWkF5UDBvN2gvS2llT3ZYVS9PeHQ4ZGpONkZSM1ZNTitRY0dOTS8yZUY3Sm45WitVVW9Pczg1VVlEeWs4ZXpEcG0xNFplSFUwdmE3ZHc2YXFTUkptQ3dvRUE1NEJWNnZEOCtjMU1peHV3MHNEQktib3FKUGR3em1aMTI4UGFzUWVGZEtaOGFUUExzSS9FN3k3aWtBQUhSemtTdUl6STNvMTZ6QVFEaFNYZURuWThVWmJ0dXJCSEpmSVZ2MGJyY1hPNHYzK2luL0ZoUXkzdXRqVDFsQWozZkZobmJkdHdOVk4xWnVaMWtlTGJBT1ZHcnVBQlRVNW9CVWZZS2doS0dSQTVEOXFiN0xpNGxCU2hYUkFabVJMaEtNZEo3UXRGVmxOV3FrODdkSmhQMEJleWFoRHhXeHRIQTlycnRubHNCRUpCUkI3OVEyK3RBZ2hWcVFiZTV6OTRoc1A0cUUwVU0rRklzcGFZYmJJZzBXd0pqNGdZSEZBSzJIYnJvZFRmeXZHdnplbUtPcWZ5cm03YVVERC9kNlp4emhDMU1USitqNnZCZFE3QS9STzhTbVVvTG95QU5aTXF6T01rb3gzQ3VPRldXd0hjVVZ1aHNvdjlzTFhPR0ZUYXZWdDZqQ2lKWCtpMEF2V1VYYk9QME1ndTZ4N1FtRGVCN01HdXJXZWd4MUNOOWp0Q1h1aEVPdmo4dlI1aTdaOTVvQTIyT0syM1VJRXRoMkNXNEFFQXpZaExLcEdldi96djdaZ04wdkFmc1ArNzJraW9UVzMxMVZ3WUFlaUUzNlZmVXpFMWUvL1R5dVhYcS8xZFRrb1RmYW1QNFJsL3E3YURCOEFtT3NKMkFVL3lMTkdMWjlvQkN1Tk5yb2VpNzZTMXRQZS91YkQ4Z0pxd1dIU2o0ZEVvTVBSdjdyL2JpeUk5aGgxeEZFdVRwZ0JER3JOWGZHSWZOKzNHNmpCSDB0Mi8ycXhGOWgwTU1MZitXMXludGJ4dE03SGt5WVU3cW5XRXE4dUtRaEhwVDB1RUg1L1MwVnJ2T2t3cEtWMWxMZTl2UVV3UUN2VHF4VmRwTEZKTWVCRGFJWXB2dHVwTzJRRXg0N3RvSWs3OTBkTW1CZXk4T0J1S0hnWTJnMVdUQU1WMGhpQVVZSVB1bkNkaXRYaXU0V3FtaFNMbGZ4em9Ca3dMSy9PZ0V1a0pKNVZFMjdYWk9tY1R4SzdNdGhUeThLZDNVLy9yMGszSDNUVWh5SUUwMlNDbnM5VTlNajhpMHRDZi9TdmZQSXB0VVhMUzlXYllSTUpicjYwSzlsdVlPODdIcmF0ZEErajJUY2hld2xRTHhmeEhTVVVFTVJyOWZrVG4zMVUwQ21uSDcrOENBRFE4eHpUamtyRFBVTlhobmNFMVFTclFkT1pLbFhranFkR0Q0MllVYVpISGdabUhmazg4Z3VoY3l5V1pPZHplWDVkQVdOS3E2T004TjNOT1o4SDFWbXZvWTdMaFNIRWVuckEzbzFVWWVJc3A0b3dFOFZJaGx4RmVFMi80RnlFRXBnd3UwdFNaYUh2K2xOZEl5M0pYNHZGc09ubkF2U1AzVXdKdkFqVjhDaVZqUDlEdk5QSGFhT2JEZm1GWEZOekVlS1V5bC9JN05ISVR4OHpLaG0xODZ5ZGduS2JlTy9yNCt6MG9lOXhQTFAra1BUVzREZyt5NzhPNUJtME5lNy9VMVpobEoyWEhUQjYrN1RWWFgyTGF2b0srTmdFY2lXZWE5OTdlcE4xY0tFdFZuOUZVbTc1NVBoOGlQVW0xVlU0RjdER2doWVU5UXNzU1d1YWV1N3JMUHJZRERpUnZEd1RtUGhPS0h6UzdqeFRpOG9OTDgvdXpZUi9oT002SU0wbUNlUTgwb2JpYXdvdXBNUG1rc0w0Y3JlODRqZjBTSzFwUEViTFhPVFlTTGJTdFo3N3A2eW10d0xqQURrSXhHRkFvb0Fmajc1ZTM5T0pJbXRDZ09DT2hoM1RzWlo3TCtqZW5CUkZOWFQ0L05LenUza2JxSVNCNk1wZEtKNDVNUVcxV3dkNWhLWFpxUGNLSno1QXJhdnU5elNUK3NtZ1pWWjVEYXBYZkZucUV3bGsrRGFENVY2SHpleDNldldORHczM21qYzBXaVVxbmtyTkNQVlpkY29FMnp4OHJyUXJZSXlxaFZ0WFVjZGNoZXdkNHhHbDlDY3NSRk0ycGtHckhLdkttOUY0NGczRkZPeDV5OTEwSDRWSHFobW1YQktab1VvUWVPcG5uK3c1bURweGhEd2hjaGJDNWs3bzBmSHZOTkVITWRTaC9Hd21BMkFjeEY4N2dHUS9tZ0lnVU0vbGRWMnJ3aHBFQStFejZIY0FBcFhmLzdZYkhHZHVnYWlGNk1lckdoclNUOEg0Qnl4VlRGTEdXN1hwVDNlR0NhYjZ3ZUlXVm9VTUJOZE5ydnVsNkh0dEgxS3BVRjJ5amtOSy9sY1YreHM2ZTQ3ZnE5MCtaWFg1dmdXUFlLcjZ2Z3VTMGVCNEpEVEtzNVFxaWJ0d25nV05kQURWS3kxUnU2ekdXdTNpeWZPR0M2UDVWWGk5NTRSZ0tXcmd0bG83aTRFSlRJNTFrbkFmSzJadFhBSVd0NW55b1NRN2pvSndlZ1dhNjZhYXRDQ0ZpanAvMVVZb2tPYTBVbm1wZHBQTnp4Nkc2MllSTXE1Z1B5WWt4d2d0QnlKOGhrSmNUbmtIaGphWnkwSUNzbEs4VDBHYlpYaUpoMlBVSVhtWjZGV0I2N1lWc2RYbGlRdHcvd0ZFdGgrS3U1K0o0L2FDRkN5dWpJNlVZbWQzOWMrUDZMdU0ra3pRSGN2TnN3V3hXK005RkkvbG9RODBqaWNCcytDeCs3UFVnY1M3WTF6KzI1RDQwYmoxckdlYlQ3M3p6Y25rY2NiaGtKNWFrK0xqZ05jSVkwTDE5dFZQN0NUUVAxYzAxRWZEMzYwN01QOFhuNjRpYWtHZCs4a0l4M1ozUjJrUHY1Sm9MK0EwU2V3REdtZFdIaVE3VFVuQk5ldXZTMGJSQWdSdXoyNi9uNm56bE9scFB5R2tBZ1FaQTJzVGwrYWNzOUQ3eVhtU0E2RW4zTEFXN0p4R3ZKV24rb3BBRlMxVWdZNWE4dHk0QS9iN2kveml0cEM5Y1Z1T3JpMDBOUDlLU28rY3Nhd2VoYU80ei9mZVd2L1JVU0Y2RFBPR3BGRzRMaGtCQ3ZhWWtuSUl5ZzI3TU9CSzkrclFTNWkyWTJmWXY5R0RqdXNURmIwWENkVXMzWDIyZzh1THFZa05QQmkzZHhJU2RYRFFkeTFvQ3lOdnJEdzVka1VKQlFmWFdhVjVBek16UURqMVBWMEZhSWdQbEJURVdGUktRMVpyblc2MUsvQytYR3I1Sm9ZZno5MEp6TlZVd1p2aDRRaXFhbXZTWGVIYzBya2MrS0xIRlhjc2tCVnRjNkttQ1VSYThLdzN5N1pOZGlPL3MwMXpRa0RHOVZheU8yR29rWVNEdVArWUVENmN4aFZTME5YaThzZ0sxazVlcjhPVW9uampkK3poNGxTYUNWSVRvWUFwTGdKWWtOdFRlY0NRbHlsY2Y1MytTTXE4aTVGM0daUjRkN244OTRaL2VMNnZ1ZzdsRjJtMUZ6TUNLdUtOWGt1dzN0dExuenhmaUNsREVOZWdoRTlmMHJhek55OTVnNDB2RnJJMy9LSzQrZ04xdmoxUG91SXlLemxsMzg1VDRDejdhMVFqaGpEWlplbVIyTElnaWljelpOVkd4QkVpckVsd01FVEJWQk1WQ1JKdFFyWEdpMlZoR2J6R0MrZmJGQ2N4akROK3I3YUZHZ3NXVnBBdm15L0lPSS92d0lOK1pxTlRZVlMzNGY1UE1jcWQrYmJPNHZ0eklhNTBKTVpuWTh0M1REaTVZbjJ5WDFwQTZLUzQrVk1GWi9zV0tHbHZKUHZnczA1V3hqYWkvcmYza21MS29qUGdxZjlEb3pvaVk0WDR4WUo0djNydCtwZ0dmV055YjZMcFdmNysyMHBocGVMekx1bWJyUE5MN1BNVW0rTEFQZ2dDT2JHSElNOHA1SnJjbXZNYkp1L01QVGIrSHZCeXE2QnE2TTI4eTlLOWwrRTZCaU5XRm9ybGowVVpqU3dhM3l5MGJhanY3bzJRczlWZ2x2R3FjeFJjRkFIbjRtVUI5cHBPUzhqNnZxNVNySGVoTk1XOGxybXpnMXZXZ2ROamtzeU8zcXYwNGNPbkxWM1NHT2pkbG1JZXIvaStQZGxxWTNjWFFPZ29PTkxKejN1OVN0WTRUeDltOG1PVXhPM0dNZ1pyVzJVVEJZSWxRcWVsR0l4aGd5bW1lRVRXeTF0dDJMMUNqb2FlQXJvdUxEdmNZUW94OC9yNWdqUVpoZ3MvQTNZTWJWYXM1QUw2ODdIYWNCNUpjaUZvcWtrY2lsYTBQOGxRV3g3ME8zVng1L09pT3RDeUFVSmltbmc3Z2tXckV1N2JPa3gyVDI4Q1E3TUxzN1UwQk1UUllsbVgzd0dKMTRqTTFxTTM5VHNMM3NjL1VZZnBXaHJuck5IL2owUStkT29RVERDcjMwMDljY21PbU1XQys2eFc4cGh5WGU4UXE1UllHT2ZLVnlzbXAybjl1WjhadFV2d0MzTGMxSWVKZVpzZnVvOXdCY3AzVk90VVNoQVltbGxaOHRETlpMQ3ZaSDI0KzVLS254ODUyUVlaWHR2SllUNFA0VkNISzJ6L1gveUNQdENPbWtQL2M1NlhGMVdhbDB4ZDRyaHZpTlhlQWtNanJPVk1wV1NEWnd4WktuU0N1SkZYRW51TUV3QUdISWpJNitFbG9uQU9Samc4S081STlSZVFlWUxWdHNDc1A4emJhTVlKeHZ3blgxdHpkUjBwZ0Jhd2NNMHc3eEdPdkUwd0pIOUFYaUFvQk5WdDJGS3c2bVdKVDRZTmJZVU04Z0RTSnNXNVhYVmZOVWhPc3dyUTc5Z3dOOUZtYTdwd29rM09QdkpWaGhBUXdMM0U0a0RnWW1LVW96Ulg0YXdhbi84bE1uOXZDQjdUTnFPS2I3MVdlOGw0UHRjbWFvek9nNEg3K0l5clV0RCsxc2tjbm9CbGFBNEgzWmJobEtmdmRJcWlkQnAvYy96Q3VyZ3FkYlUxVFFUTi81S3ZpVUs5NDhWTHFDbGpZWEZqUjZMeXdNSytPbDRVNzM4aWZNM21pa1JjckxLdnJUaHZGaGplZzgrUC9WWnkzZkd1SWRxbjdpWm5vWWJjb0F1Umh3eUFDeGNDVkFHNDZsTjE0Q1B1RGtYTzlUSXhoQ01VWDlCcFdaL1o0L0JHaUVSa09Ba0tqVDAwYTY0YVNJb2F1aGdjK0lkaTlHY2JoWXJoR0VmbHRWVk1La2NsQzF0THJrWGZtOVpEMTQ5T291WEM1T3RKRVBJUGppckNiYXFNZVJqNFFDSjdYcDQ1SldTMDVTamwyTjlacXF6SklQUHNORGlFTTNVTXo5ZkgxbFlmdlZpa1A3NFYwbGRybThVVHpkWkkxMER0OEdVcnZvQkVPVTU2L3VYdEhTeHhlbjdKaGhHdWtsNFg4WGhGellORERKM0NEMTJyeEo3cDFSWVNmQlArenl6MmFBSmpJbGxOemthRXpONVlUdkZnOFF2cjhFazVXY29sZ2FOMkhwcXFSWjdITVkxc3ZvSHRsWC9RL1pONG5ZcGJsajJtRmNhcXZJT2xGejBlbnFWQlJsdHpQMkRzTzVsL2JNUFpzN1FYbkJPeG5FWFJtYzdjQTh2WG5vK3RkbG15emp1Zm0weEYyL2JOOFJkUnpyWHhWTnBUeC96eXJTbGUrcmhUc2dBSWRaZjRRdGtzVVpPTWF2NE1jR2ErcWhTS01HRk03NHdxTEVSRzlWNHNSbjAyb0pmVlB3RlVSK2xzSnZUY3hiVlU1MXYrN1I0ZTVmNnhYY2hQbGhSUFcvcURaNmU5emQ4UlpjbmxOQXI1WlMrUDN0TnBjZXc3N25wWndORE5VMEltRHF2MWd5a0dZQUFKYlllV05GQ3JFeEhXc2NHTWJQZ0NKSFpaL1d2M3NpaVc2WTVJOW5wNDU2NmtiWGVrMUtlcSsyZXZRZkt3S1VTMko1NWNRNENHRVBhL05RZWlRUEdnSExGNHpMSWhtcmdMejFSekJ1ZS9UMHpCVXpVbytxbVJsM3FPQWZuamVkZE1OaEpxcitaOXNSeTJCalNLaW5od1VpVm5oWUJmalJOanM3T1VtcmpQaHFjbmdyRzRBbDY4VVNhNkpIYm5tUktBbU1FT0h5Q0F1cG03M3RWNHQzL09XdVJkRXBabnlOZXUvY3BxU1ZjY1RJV3dBckRaQlB5Smo4eGtDaDFwVzJrQ2dXVlNHalNSSk00dGx0dmJxd1ViOTBKdGZuMW5yallRSDhvNHVWUksyQXBISHc3UVVsMUNaMlVJNTk0WnF4amRUdmxiOEtIYWw0djl5dGxsUXlLcUd1Z2c3Uk9XL3B4b1hGYlBIT3h5NFg2UkRlNmpKcDl2cHNTSFFCMUtIeEZyazc4dm1TdkhnUWNDeW10OGl3dkM3WTBiMHQ1RVU4SkNoeVFPMm1JUVJVRmFPZ3VCN2FPNGdvLy9Wby9HYjZaY0doNGNHNlVSK01uRnB1Q2JMK1Z6ZHE4WUE4T25mQ21DOVR5a1M5YSt1YktGWER6emQ4MWpyZ0x1dlV3NWtUYlBpUHNKbEVWUC9HU0NsbXdZTUVDOHhYanFBZ0J3ZEQ5emtMcjRESUR0OU4zTHg4dGJ6dHI0UWdpaElrekdCUVJiTENBUWxXTytSNzNNVkFNN3ZPdm4vT0xzaVFHd1JZRUkzcGhCT01uMExEVnlEbUpuYjVERHY5a29PbWQzcXNTVkxYQUczaGNFbUpEUEJDWDduNjBldVNrZitUNDZCaStMc2N3MzN6cm1KYzUvaExvNmxIZWNySHZEaXhBZFNaT0wxY2hEak1JTU5uZldyR2w3R0Z4d0tCVzVCNDJNUlE5cTZLNWZJeEVSam9HTmc1UE5wNmpPUkdHendtVUhYQVA3OTZVRzhMeHQxaXBCSFhKNFp6N0t1SVFyK0NXT1FlR2liYk1wdkc0NTdPQUxvVXBRSmlMN3JBa21rc1JOSVJ4cXhNY0V5TXB2VnlXelh6QXlucXpVdEswTVJHN1V6bTNmcURIYXhtZzlHRnRMMmRSakMyUDRtYTZ0Z0Rob3JtOHl4ZnNkZ0RYQmFyQkNFN2hZL0UrRXU5dlhGak9XUE5NTzh3eG91NFZKUWJaS3dwZ0FidGpUd3JMWDhDMnhML291d0ttcHdBY0Iza25lN3VKVTQ3cFpocE5TaFFXSFBaT2lCaENra3N3dlJhYWIzelY0QXF0WlNBNEU4Q1VUY3RlTWRpSVBTNCtJTkVtdU42cTg3RHgySFB4ajNKSXViSXF1TW5GVk1uakluM2M1b2p0ZjRyblRrOVBtWG05eTNKTUNYK3FVRExNUTEvVktuMWlQbjQwcG1KVnVqRXRSQnBQRG9ja2Fhb1VlR1NlM0JMTldrQzhOOGpuR0p4TVlGMGFmMVpYRVB4RE1vb2xjQmxNS0poSEtDRGlmVS84eEtXS2JzbUZvRVhCYnNaMEptNnEyVFlDNlBvSDhBb0pIWEwxSFp3OUU1RGcvRW9SNmhJNjdCbXRVZiswYlVhWXVORXFvenl6T21oRHJTL2t0azBoejlLTldISnRiQ2o4b2c5OVF2RmoyWHpqSDd3ZVRGRlJaY1JaZE5hZjVSbEFOdi9jNUM3N1JZclJMK1IxbVZrZUcraWZpYUR2NkdrQng0T2c0TXdDUDFHc25xV0t4ZFZWMng1KzBaUk8zdUxkUHNjNkszeWpiOGlZV1dWUXZma1ZaUlVLTEhnSncvR3BhTjE1NkdrVGJucnpUZ211NGt5ZlgrSTlWYzA5Z0ZxeElyRXd6SktpZUY5N2JJV2EwWGxBSExsVnhGeDNWVVNPRk9yQm94YTdOb2FrYnNMdDQrMlpkSjF6a0NNd3htUVl6UkdrNDBPb3JoMEhkU25PL25QOElqd2VobGRQYlJZNGhqeVpkc1RpMUJCNjZGKzJwclRBZ1NDZnh6NzFuV1NqL3lUOHkyYjVCc0o0aEVJdEdQZ0FKejVvU1YwaWNON2JDZ2JhSWZPQ2JDMm9RWkdxSzF3L3RXU3Y2R1JKY1dhWllrcFNtWFk3NXZHeU1PejZFRm9nenNaVHpNc3VYZjZ5SzhTYzlmS1FBNkZ3ME1EK2Y2WmNDYm5JWXhuY0JVOVMvOWl6VmhmWnNqS2ZIWTlDcy9VbFB0OXpXQlIvVHByMFY2U3RsU21KV0xvMmYxTkQzTmFBNXZlVUVYUnIwWWpib1RrYUkyQWM5eHJUQXFMUlpiRHBYNUV0dCtlV2ZYVEhmVTd1YnJzMGhlaFRsSDVLU09QUXB3M0xjL1dwS2k2QS9kUzNZZkJucXZ4MnYrYTU5Nkd1S2NKdjVKR1BNQnJqcDVJSXdhdGhvOEt2NEJTdXM3dUFMTGNSMDhGOUhPamNrclRTZ1ZCRVBCeEh4dTNBRjFWbXo5dWpMTmZjYXVlM1JxamFhcm43djQ1S1BGVUhwK0xLMkhBTHlXbG5BTDN0REhVdnhNZDJPSldZZlh2dGhBUUgzdUthdC9oNzVsd2JBQ2JPeE1scjJQTDVsc1J2UStjZ0g3U1Z0V2U3MmJ5OGZmK3FtYVk0NEovQlR1Z0tBTlVnT3NGczVBbnVsTDI4OHYwZmUzcWRlbDl4Z3RmbkxMUTQrbGZWVnhqRVRxTTVPTFczYWgzWFBkcEVBZzhpNVpxVVJxNDlTTjBaaVlaU1JSc2RUSVY0bzUwTGtUTTRDbjB2d0lxcmxCbmNFTXFCa0dBYVdqQi9xK0tWYURSMWpYcU5kWTNKMWtmNzg2Umo3WHBhMkdMdmdreVNLbXAxeFdGTWtkVzdXMS8zbE5DNTFsNVJpNmJ4MXZnS2crcUJ5WUt5YS9xdExzMWExQTJ4UUFTSUxudy9qRnViZzBwbmU1Q3FHcUNOYVZYMXZ6NTJwVVZ5dlFBQ2RCbFZzYnlhWXFHYTloRlpTa01PWkFWOWFyVndZM0JXMEYwK3hybllrTUNDN1V2QXdwajVsVTVDYll6TjQrWURtWEw3dlliNFEvdERrZHlVNGoxc2hmelhleWw5N0wyaUNkRjhBL0x0QWtESkozVG5md09Wb2JrTG9JV0dvcHBsQWU5L25Wemorc2xUZGFadVpGdVdGNSsweVhKRGMwbUg3M05CNlppbStST2xqajh0Y044ZnI0Qm9IVTZBeUYyQlduaVJPWWUyV3A0cGVXN2NzL2dDKzF3SndIVTRYQjlaajlhczZ6aFM3SGFXWjFFZU5EWHpuQWhVVHBSRzgxRllBSitWZm5SUGtSNzA3MXU0SXExSnhLOWY3cS93S1kyN081a3gzSDRtUE1lSHFmc29JaDBNbUkvTjJ3dGlSaCt2UTViOFhXTEI2ek5hLytUOHhnbXBPWXN3L2MwdTZXQXZDZHlrbVRnN1lEY1RnOUl3b3BzdTlyaHZGS1Y0Vi9uc3RtVFNHakZvQ1U3aUhDK3lZUjZPMC9hcXlUeHo3NnFVSEg1NVMvcC91OEIwVWJDNjM0aXF6a005aXFmcFpQbzVoVFFjb1NJcFMwZldFYU9hTG5CY3g4VEY4cnhVVDZsRThwdk9qMTFCbW5LSno4b0d5YUZxWGFvVFRBZnJ1WVlYS1N0WXl4Z09HemFqejhvTWFoUGRkSWhEZ1JyK09EMnV4Q2pwZkhWci90RGM0YzB5bmgvV2t4SnI2QzdGUzVrRm0xcnFtekI0YjlERitrc1A5MVN4bWVyYVcvTjhqY0NScXRNMEF6YkZ1eTJBblhmREc2T0FsVTVldlV2ODJBRkM4cXFpanYvbDJlcXphSTZ5bnpNY2J6SzVmZTlZMDc3R25pU2N2cytIV05aMkFpYUNZcXYwVVhrTG15cW5DRThQVUR4UDdNRW9SZEs3UE9kZW5mZzFzbW1ROUVXTUxFV0xPQlpYdGlTTHk2d1NjMG43WjgybkNCYmRJcnpjdkZhYzlibU9aN2xBbUpURVBVZzdicVdUWEtSSWJVRm1jekZ5WHpveElld2Zpd3d3UktGSnIzNVo1alJnTzBMb1UzeFBaYlIzQm9LVnRjSmJpbndoaURqTkMyOTM3Y2xkWHZIQ3dWeU1TYUFnanRxaFljSDJKd1pDaUFNc09DMGZJTForQjRkTWtzbGNHd2RpT3FkeGdLMDVCWVZHRDJZaU05b1ZZU205c0xWY0VhTDdpbnBZRk5IdXhvelRyRVE4MTE5RVA1blVXQlcra0hpOG56MldkTjQ0TzhWNE5FY2hPVVFBS0J0KzNTRDV6aVVXaWZIczVWSS9nOVhnTFFDOUtFUHRhbzcwMGhBSDZRRW14UFJ0YlU5VjNRd2MyTU9RdnIzampMM0JCbzlQc3E3dDJFUG9PVUp0bGd4YzZaVFZJaW9yQjV2Y2F5TXhmUkJCNEh1NEJ6U0dsMm1uK0t0NUkyaVgwVDFKb1hMQnNJbkFVZmlpSU40dUVYVjRhd3p6bEJaZmNNVDJLbmNiK1E9IiwicyI6IjFlZTEyYTVkNTU4NjE1ZjMiLCJpdiI6IjA1Mjc2OWZhMDM2NjJlMTE2OTEzODVmNmZhZTA3ZTdkIn0%3D&public_key=B8BDED1B-BA3C-492B-AEDB-016DDA3E4837&site=https%3A%2F%2Fwww.expedia.co.in&userbrowser=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F133.0.0.0%20Safari%2F537.36&capi_version=2.11.4&capi_mode=lightbox&style_theme=default&rnd=0.5353301575613918&language=en-EN';

        let config = {
            method: 'post',
            url: 'https://expedia-api.arkoselabs.com/fc/gt2/public_key/B8BDED1B-BA3C-492B-AEDB-016DDA3E4837',
            headers: {
                accept: '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                origin: 'https://expedia-api.arkoselabs.com',
                priority: 'u=1, i',
                referer:
                    'https://expedia-api.arkoselabs.com/v2/2.11.4/enforcement.9eab88fb89440e9080505ec7f1f1b658.html',
                'sec-ch-ua': browserIdentifier,
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-storage-access': 'active',
                'user-agent': userAgent,
                'x-ark-esync-value': '1739985600',
            },
            data: data,
        };
        const fcTokenResponse = await axiosRequest({ config });
        return fcTokenResponse.data.token;
    } catch (error) {
        console.log(`🚀 ~ createFCToken ~ error:`, error, JSON.stringify(error.response.data));
        return { message: error.message, status: error.status };
    }
};

const createLoginFCToken = async () => {
    try {
        let data =
            'bda=eyJjdCI6InNPSEV6NXB4QjhqMUNDcW1PREdGR0xIZ1VSaC9SamF2bFp2WkQ0d1NDcnB6RFA1ZnZKZU9FYU5tNWVmcWowRDAvby8rMWxic3A3K1NFMXkyNTdlckY5VDlraVAyZmxwdzF5RUZUZkhlcmRZcWVubUdka2F4bUJRbUF3WjZ6SjE3cUpBVVozYThaSGdLVUJQbXhxdHlJdGM0MDhDNG50U2YzMDQ2aDJMRm8vbkZ5T2F4WXg4UklVWGUvQUNSWVhSSm5nVGdDS2dsMnlNVzlUOU9QTld5dkNXTGkvOVVzSmdjd0NSSW1GM2xPQlJmb2VnTTk2MTAyWjVRQWR2V0hkcUNJMTc3bGU1aGNnR0tUV0hSemlzeHJ6OEJCajFXTEl2MWNIdEZwc1p3QVl5VE5ZL1A1ak9KbWdBa2RiMi9Nc3FwaFNtdW8vNDVsN2tUWVYzQk9hU203Y3hvYkdWYWdNMlZVb2pCWVJIdlAvVStzQlg0NXFHdGthbEhXdTJuUDlSR052UStoeG9zSFNjLzhKK2Yya3Z1d2szZXQrTjlFUjJrSEtxZFFkUVQvd0FGMmRwaVR1MTdRMmtKMC9SdWhuUHpGd1Zrc0RNcXVsQzJuL2dPblhodFBFSUVOcGxJcGZNcldYYTUxSWd6aWVRVDdEQnQzcDAwTTVxOFFOc0RPamh2amZ1UU1oaGIyZ2dHVHV2SU9vS1VXVXBFd3pLb3M4Vy9XZkNNOU1WQXhEVHloeUNTMlBYTTFWUjl3RDZGU2EyV3VBOThOcUQ2MmZOb3F1cHBWcEMyT3g5RHFORWtjYmsveUR5eGtwRy9rQUNjbm1Eak0yT2pSTWFSQWdaOXN3UjVJZ21mOVNZYXYzZ2dacFJCR1lHZk9ya3lsVGg4WGFUYVA0bEZFNTVWc2dJRWw2b011bWdnN0Q1YVRiU2ExNEI4cG54K285d256RExvc01XTFM5emVLRmFJUXkxOGFYYkdGd3AxaHZJbHVNbzZ0OXhDZjlpZUlkenFibmp0NFlDKzlGcHd5Rlo1YlNUYnZEVzRiOHQwUXc5VTRzb29Lb0xMM3NQaS9aSlh0cnpNMmRDUytVcmNRV1d1UDB6UUhhYkZsMFpGK0d6eTlydWxGaXdQdzJLRUZEUE9zUjVEaW5PYmRaOUd4VGxmM0NOMWtGRHNQOUhydjRYbmt0WW9QcWFrMkRUZjR4UG5tZ3RjNlRjamVzTmhWbkRZWklPSUk0R3hhc1VkdjEyRjArMWI4enY3OXFMNnRUL3ZLc25XOGI4d0l0TG9hQ2FNbFl2V3ZxdWE4bGhadWc2ZU5aMEtWOGFwd3ZCNVJoM0ZISnVra2lBR3lpdSsrY1ppWnQyd0hXNGE0V1llK2RhWHVTa3Y5OEhFV2s5TG1vYklUeS8wSThiMXVKVGswb2p0dDMrTjdRY2pwcUZvVzlkbGZ0elVYczhsMTNlU3JadTcwUGZtckJyWnAvZFNxdEdHbXNraitxTDMzaUF2K1JMV25pMEpoYXRwdDM2RUJ4MzRHTG5oTlpBRndXWHNXbnJmblloK0hKU1hXN2RqU3N0L2x2Nnc1b3FOUUh1TTlPVGxPTmFoU2FFWHlkQVE2Rjd4d2NLSENmd01SN3JpK0hvci9JOFg3V0EvZ3pWcEJZK2xzMDFVUUxmdm9peHBMclhlZHpyQzR6QWdjeTZLamZPVmh4NjZoMGNlOU1qZlY4a1BoOHY3V0tUQksrNWxGczZQZjZ2UUIwTktIR2xjN0VBekxLUHNTaDdObmd6WExzazZDZ0NHZGJkTC9oWGJ5d2lNRVVMTjVOSWZtRjJEOExYanV0RUZvSEFVR1VqamFaOGcxdm1CYWtISTNhRDJFbll6dExVQnZsTkFJQkRka1BaVDJaTnQ2ZkRkYkdncXhFTUh2bnRqRjN0Y0h1N0VKUFVSY0RuTlJKUDVsanNsTTlLdUNDZC9SQnJzVkZZclA3VCtvcUJrSG9xSkE3QjVtMWN1bjlQQmRDL3FPbkJ5cEtwM0hnaytKbm15dmR3Z2xNYkpsUjRIbUErTSszRTBuUEJ0K0I0MjRxWEpjYklvT0lITDViZ0VPbVJudEtJVGdKdlR5WXJlSjhwdmM5RXY4bDJvVUk4aW1pemFWcU1zOXcva0JjckJaTUxhY3ZtdllMaEE2ZnR0NUUzOENHVXJTaWc1T0RkNWpEaDJHZjBhSlBQMnVBeEFhbG5YdzdyMFZaZzh4YkNnQkt0Q2JyTGhVQzI2L3FTRmtxTWExeVlWTGF2MTZHUUg0OXUxZ1NuU01KaXEzbnRMUzlTbGQyVWNzQVcrWDJhSTdXZ3hrY3ZXbncwWEVPWndYelNwQUVYQWJ6cjBjM1pSbGtkMStkcWh3dld3dnBrZi8rbTFrR1loMUNNZFdHOCtQOEt5U1o0WUwzVVpLSHpNSTgxT1hmUEU5RmdVTmVreUtkdDNoZkc1UmZ6bjJDTWtpdVgxQW5pekkydCtWNUxZLzRmaEhkcTdxb2tBNW15WmgyY01nQ1o0b1NVWWF3WDIvMlU0TVBJVnQ3VlZxaVhsM0NwVlJaVVAybnBUUzU0cTArK1BLdmhyRFphSnRTcy8veTkrQzVETWMzUVJweGNOenBHRklvNktjYk14bmZBWURKZHFKNEFHQy9JZkxDUzNQajlBZGNkZ2VrNFpiRjFOQXEvcWo2ZnpXWm5YZjFFZUpENGdmUzNzMFV4bWxpNHp1MHhqK0tUUUZiWlI5UmVvdThJY3dJdGwrWVd0Y25kSUhqQnk2eG5NMXBnQWw0bHFNQnI3STh3UHc5bHZ0M3ZRNUNzaHMzc04yNHNiUkhDNmxKY2hOTEpaelhxQkFRV2xoYjJWL0E1RWhJcVBNYXpTOE85eXBKbm12Qyt6TXArc3hOeGdlbmV1b2Y2YWZFdUF3b0lDQm5STzdFeUE5NXFhUW81QnRGd29FM3pXTVFidTFoNGI4Mzd2ZjhIdUg0cm93RHNJcWwxanRHS2V1WXZIN2ZrOWc2cE5PTzFFSlQ4dDVmTjRTa0FlSW1ERUQ1aXgrT09iWUpwMVROMjd1VUlKZk1LQXNlbi9vQTdKMkQ1c21CVGpFVmpGRGhhM0ljQkxpTGh2U0tFdTJkWnRzOFI0Mmx5ZWRuekx0UTZyT3pQbDlFVWZ3Z1g2RSt1QTVqWlFKV3F1RHNVaHdsUnYxd1UvcVdWQlNTSVMybys5VGswV29GcmFQQjNadGlhVEtQVjJBbmFQK0lGanVLdVJ2NFJ0OEpZVkZLNncwZmNrek9JMUxHUVNPQWJVTmxNN1V4SlZJbUJ3em0xVVhUREdnYWt6MEc5ck9LdVRaSUNxYWZaZ3I3cmxnM3ZhTnh3NFhsT3MwOXVFUDd2bXAzdG41ZlRwai91YmhoQ0VaQVpJWXlEenpLNm0vUVpaUDdWQWo0MUtMcUFjdXUxYkozZy9odXU1TDB5RTA3VG9VNkxVZm5QMEVzUm5oOUNtaUNCZGhYTk1IUVpxV2VOWWswVXFwWWpYTkEzSGNTeGFJNFl2NUlTWlZrTHBPZDRBUG9sOHNUWERHTXZmVTNBRGJsbWxuakpKclBvMnc2SFAvV0FRSXFBMU1telI1UDl6RjRBSElVak9mU0VIcVBvOWFKMHpJbXlISWRIYXVpd0FseTJOcUhhcXRlY3Q2WWVKY0phaTk1VkxleHIyekRBaE95cGcwK2QrZTgrMDV2NW5mcUtUYk5vOVdKWjA5NXFYU3lDaWcvR0liQStxK2RxTEEyOUIwQTZIRlBES1NVYVI2bktSWUszQW5icHdQNFQ5MXNPTy90Vjh4OGR4dUtOdGhWY0hxMmNOVWRaeVFqUFNud1Z2V21CaTJTTHF4UnhQQ0VKVUJ5Z040bU9jKzFNSVdrcWhPRmRRR0lLUElIbUZDV1FqRWVNdFBhUHVESHR6dUpGMUx0T1hFWXJMN3VITFFPOWR6RWI0ZjRVM3c0aVR2OFBHdkVmN1ZwbXdST1gxZTFjV3JIVXkzODlBUjNqcUFYTTdPbmppdDUwemdsMTQrSEE4UzNzemR6L1p3WTdHc2xZK0N3b2xGSXRaQXZOOHQ3amc5cmJVelNNWEllRFhMZDhuSmQwTHZ1SXo1VStMOXN5anE3OXl6bUwwSjczT3VWOGJRRVVUKzg1MzlacnFKMEZibVJMOHFOU0wwbnpKK0l2b0FrNmZBR24zZ1MyV1FwTU05RVlQTkxLUzlkektZVzZGcGxGa0I3anhpeC8xU3A3M01BdVgzQ0VBVFFQejdORFNuWEh0TklqYTdXUHNmbm1VQ3U3Q3RNR1VKREFSQy9mUzZjV2tMVmdJWkRIcXdTY01yRHlZWEFtc0RkalhjYUJRWHBPNTlSWFBDVlVIbjlVYVFaVXlNMkkyNXlnQ1VUYk5ScmZwRGIySWp1RkRtKzZPNjdlY0dHS0lTOE5hR0R4S0xqay8zdzg0aHV5RUVIVDlmZzlRYnd5WGFXZEpRbWNkaC82NmgzOFJDTXBIQXMxd0cwSXNQM0Mrd2J0YnJxd2o2aW85bU82WG1lSFVRYTkvR1FHamhBU05sTklXcGxZbk9ZVk0rVFdmN2ZmZ3d3bVYxT2lsbmRlMCsyREp6anVxanJJdFF0SHdIM01LQit4QUR3SnhYdU54UjNMdXo1c1hVam5uTm5XSGVvZVdWZ01DTXBkb3dkVVpZSWN4VjQ5TFluTEM5c0EwMjF5MzJNblV3c2JSOU5RQ244dWtHY3V2dkN6cy9tVHpmSlVSYU9OZWttVkVnUHFhdUtRMjZMbVpRZ0hqSXdTYUxKNXkwWmxMam5MTUF2dGt0RVFmN1VlMmU0eXhNVG9lVUNGUXFtVCtuUTlKSDdWWUR5dUhSS0tGVkdZZDkzMXFZYTFmVWhRTVFidnQ2cGxKZHdnRWM1Z21kandMd3BNRnFsUk96UWlnOGlVSkh1VlhLenAyYXV3ejVJV0xkdjhtZEZKZThyMHVhZkNEcUFWZHpQS2JrZWVkK0lqZXdzWGlKK1lGTVV3eFBjYk1hNnA4S1pxM25xRkhMZTNMM2VJRk81OGM4VGpFS2VuaVNMWmtSUmcvejZjMzdHRTNBMVRnZlZyZFVlWFlLZHdjQ2RZVkV2Y0NXajBaQS83cVY1ZmwwZkYzc3JTNmh0enZRdEJpSEhEOU5aUmF5Rk1hN2UvdWxwZW9aaGhTR1RYZ0k0TjdvM21MbkRnaytYTUdYWUZKUXd0bkdlUVlTUUlONFkyeXF2aDUzcUc2dkw3cXNPbDFBbEhzeVBRUFUyM3lRc0NGeUdjQ1k0ZlA0c1JaZ2ZUaFdJWkF5UDBvN2gvS2llT3ZYVS9PeHQ4ZGpONkZSM1ZNTitRY0dOTS8yZUY3Sm45WitVVW9Pczg1VVlEeWs4ZXpEcG0xNFplSFUwdmE3ZHc2YXFTUkptQ3dvRUE1NEJWNnZEOCtjMU1peHV3MHNEQktib3FKUGR3em1aMTI4UGFzUWVGZEtaOGFUUExzSS9FN3k3aWtBQUhSemtTdUl6STNvMTZ6QVFEaFNYZURuWThVWmJ0dXJCSEpmSVZ2MGJyY1hPNHYzK2luL0ZoUXkzdXRqVDFsQWozZkZobmJkdHdOVk4xWnVaMWtlTGJBT1ZHcnVBQlRVNW9CVWZZS2doS0dSQTVEOXFiN0xpNGxCU2hYUkFabVJMaEtNZEo3UXRGVmxOV3FrODdkSmhQMEJleWFoRHhXeHRIQTlycnRubHNCRUpCUkI3OVEyK3RBZ2hWcVFiZTV6OTRoc1A0cUUwVU0rRklzcGFZYmJJZzBXd0pqNGdZSEZBSzJIYnJvZFRmeXZHdnplbUtPcWZ5cm03YVVERC9kNlp4emhDMU1USitqNnZCZFE3QS9STzhTbVVvTG95QU5aTXF6T01rb3gzQ3VPRldXd0hjVVZ1aHNvdjlzTFhPR0ZUYXZWdDZqQ2lKWCtpMEF2V1VYYk9QME1ndTZ4N1FtRGVCN01HdXJXZWd4MUNOOWp0Q1h1aEVPdmo4dlI1aTdaOTVvQTIyT0syM1VJRXRoMkNXNEFFQXpZaExLcEdldi96djdaZ04wdkFmc1ArNzJraW9UVzMxMVZ3WUFlaUUzNlZmVXpFMWUvL1R5dVhYcS8xZFRrb1RmYW1QNFJsL3E3YURCOEFtT3NKMkFVL3lMTkdMWjlvQkN1Tk5yb2VpNzZTMXRQZS91YkQ4Z0pxd1dIU2o0ZEVvTVBSdjdyL2JpeUk5aGgxeEZFdVRwZ0JER3JOWGZHSWZOKzNHNmpCSDB0Mi8ycXhGOWgwTU1MZitXMXludGJ4dE03SGt5WVU3cW5XRXE4dUtRaEhwVDB1RUg1L1MwVnJ2T2t3cEtWMWxMZTl2UVV3UUN2VHF4VmRwTEZKTWVCRGFJWXB2dHVwTzJRRXg0N3RvSWs3OTBkTW1CZXk4T0J1S0hnWTJnMVdUQU1WMGhpQVVZSVB1bkNkaXRYaXU0V3FtaFNMbGZ4em9Ca3dMSy9PZ0V1a0pKNVZFMjdYWk9tY1R4SzdNdGhUeThLZDNVLy9yMGszSDNUVWh5SUUwMlNDbnM5VTlNajhpMHRDZi9TdmZQSXB0VVhMUzlXYllSTUpicjYwSzlsdVlPODdIcmF0ZEErajJUY2hld2xRTHhmeEhTVVVFTVJyOWZrVG4zMVUwQ21uSDcrOENBRFE4eHpUamtyRFBVTlhobmNFMVFTclFkT1pLbFhranFkR0Q0MllVYVpISGdabUhmazg4Z3VoY3l5V1pPZHplWDVkQVdOS3E2T004TjNOT1o4SDFWbXZvWTdMaFNIRWVuckEzbzFVWWVJc3A0b3dFOFZJaGx4RmVFMi80RnlFRXBnd3UwdFNaYUh2K2xOZEl5M0pYNHZGc09ubkF2U1AzVXdKdkFqVjhDaVZqUDlEdk5QSGFhT2JEZm1GWEZOekVlS1V5bC9JN05ISVR4OHpLaG0xODZ5ZGduS2JlTy9yNCt6MG9lOXhQTFAra1BUVzREZyt5NzhPNUJtME5lNy9VMVpobEoyWEhUQjYrN1RWWFgyTGF2b0srTmdFY2lXZWE5OTdlcE4xY0tFdFZuOUZVbTc1NVBoOGlQVW0xVlU0RjdER2doWVU5UXNzU1d1YWV1N3JMUHJZRERpUnZEd1RtUGhPS0h6UzdqeFRpOG9OTDgvdXpZUi9oT002SU0wbUNlUTgwb2JpYXdvdXBNUG1rc0w0Y3JlODRqZjBTSzFwUEViTFhPVFlTTGJTdFo3N3A2eW10d0xqQURrSXhHRkFvb0Fmajc1ZTM5T0pJbXRDZ09DT2hoM1RzWlo3TCtqZW5CUkZOWFQ0L05LenUza2JxSVNCNk1wZEtKNDVNUVcxV3dkNWhLWFpxUGNLSno1QXJhdnU5elNUK3NtZ1pWWjVEYXBYZkZucUV3bGsrRGFENVY2SHpleDNldldORHczM21qYzBXaVVxbmtyTkNQVlpkY29FMnp4OHJyUXJZSXlxaFZ0WFVjZGNoZXdkNHhHbDlDY3NSRk0ycGtHckhLdkttOUY0NGczRkZPeDV5OTEwSDRWSHFobW1YQktab1VvUWVPcG5uK3c1bURweGhEd2hjaGJDNWs3bzBmSHZOTkVITWRTaC9Hd21BMkFjeEY4N2dHUS9tZ0lnVU0vbGRWMnJ3aHBFQStFejZIY0FBcFhmLzdZYkhHZHVnYWlGNk1lckdoclNUOEg0Qnl4VlRGTEdXN1hwVDNlR0NhYjZ3ZUlXVm9VTUJOZE5ydnVsNkh0dEgxS3BVRjJ5amtOSy9sY1YreHM2ZTQ3ZnE5MCtaWFg1dmdXUFlLcjZ2Z3VTMGVCNEpEVEtzNVFxaWJ0d25nV05kQURWS3kxUnU2ekdXdTNpeWZPR0M2UDVWWGk5NTRSZ0tXcmd0bG83aTRFSlRJNTFrbkFmSzJadFhBSVd0NW55b1NRN2pvSndlZ1dhNjZhYXRDQ0ZpanAvMVVZb2tPYTBVbm1wZHBQTnp4Nkc2MllSTXE1Z1B5WWt4d2d0QnlKOGhrSmNUbmtIaGphWnkwSUNzbEs4VDBHYlpYaUpoMlBVSVhtWjZGV0I2N1lWc2RYbGlRdHcvd0ZFdGgrS3U1K0o0L2FDRkN5dWpJNlVZbWQzOWMrUDZMdU0ra3pRSGN2TnN3V3hXK005RkkvbG9RODBqaWNCcytDeCs3UFVnY1M3WTF6KzI1RDQwYmoxckdlYlQ3M3p6Y25rY2NiaGtKNWFrK0xqZ05jSVkwTDE5dFZQN0NUUVAxYzAxRWZEMzYwN01QOFhuNjRpYWtHZCs4a0l4M1ozUjJrUHY1Sm9MK0EwU2V3REdtZFdIaVE3VFVuQk5ldXZTMGJSQWdSdXoyNi9uNm56bE9scFB5R2tBZ1FaQTJzVGwrYWNzOUQ3eVhtU0E2RW4zTEFXN0p4R3ZKV24rb3BBRlMxVWdZNWE4dHk0QS9iN2kveml0cEM5Y1Z1T3JpMDBOUDlLU28rY3Nhd2VoYU80ei9mZVd2L1JVU0Y2RFBPR3BGRzRMaGtCQ3ZhWWtuSUl5ZzI3TU9CSzkrclFTNWkyWTJmWXY5R0RqdXNURmIwWENkVXMzWDIyZzh1THFZa05QQmkzZHhJU2RYRFFkeTFvQ3lOdnJEdzVka1VKQlFmWFdhVjVBek16UURqMVBWMEZhSWdQbEJURVdGUktRMVpyblc2MUsvQytYR3I1Sm9ZZno5MEp6TlZVd1p2aDRRaXFhbXZTWGVIYzBya2MrS0xIRlhjc2tCVnRjNkttQ1VSYThLdzN5N1pOZGlPL3MwMXpRa0RHOVZheU8yR29rWVNEdVArWUVENmN4aFZTME5YaThzZ0sxazVlcjhPVW9uampkK3poNGxTYUNWSVRvWUFwTGdKWWtOdFRlY0NRbHlsY2Y1MytTTXE4aTVGM0daUjRkN244OTRaL2VMNnZ1ZzdsRjJtMUZ6TUNLdUtOWGt1dzN0dExuenhmaUNsREVOZWdoRTlmMHJhek55OTVnNDB2RnJJMy9LSzQrZ04xdmoxUG91SXlLemxsMzg1VDRDejdhMVFqaGpEWlplbVIyTElnaWljelpOVkd4QkVpckVsd01FVEJWQk1WQ1JKdFFyWEdpMlZoR2J6R0MrZmJGQ2N4akROK3I3YUZHZ3NXVnBBdm15L0lPSS92d0lOK1pxTlRZVlMzNGY1UE1jcWQrYmJPNHZ0eklhNTBKTVpuWTh0M1REaTVZbjJ5WDFwQTZLUzQrVk1GWi9zV0tHbHZKUHZnczA1V3hqYWkvcmYza21MS29qUGdxZjlEb3pvaVk0WDR4WUo0djNydCtwZ0dmV055YjZMcFdmNysyMHBocGVMekx1bWJyUE5MN1BNVW0rTEFQZ2dDT2JHSElNOHA1SnJjbXZNYkp1L01QVGIrSHZCeXE2QnE2TTI4eTlLOWwrRTZCaU5XRm9ybGowVVpqU3dhM3l5MGJhanY3bzJRczlWZ2x2R3FjeFJjRkFIbjRtVUI5cHBPUzhqNnZxNVNySGVoTk1XOGxybXpnMXZXZ2ROamtzeU8zcXYwNGNPbkxWM1NHT2pkbG1JZXIvaStQZGxxWTNjWFFPZ29PTkxKejN1OVN0WTRUeDltOG1PVXhPM0dNZ1pyVzJVVEJZSWxRcWVsR0l4aGd5bW1lRVRXeTF0dDJMMUNqb2FlQXJvdUxEdmNZUW94OC9yNWdqUVpoZ3MvQTNZTWJWYXM1QUw2ODdIYWNCNUpjaUZvcWtrY2lsYTBQOGxRV3g3ME8zVng1L09pT3RDeUFVSmltbmc3Z2tXckV1N2JPa3gyVDI4Q1E3TUxzN1UwQk1UUllsbVgzd0dKMTRqTTFxTTM5VHNMM3NjL1VZZnBXaHJuck5IL2owUStkT29RVERDcjMwMDljY21PbU1XQys2eFc4cGh5WGU4UXE1UllHT2ZLVnlzbXAybjl1WjhadFV2d0MzTGMxSWVKZVpzZnVvOXdCY3AzVk90VVNoQVltbGxaOHRETlpMQ3ZaSDI0KzVLS254ODUyUVlaWHR2SllUNFA0VkNISzJ6L1gveUNQdENPbWtQL2M1NlhGMVdhbDB4ZDRyaHZpTlhlQWtNanJPVk1wV1NEWnd4WktuU0N1SkZYRW51TUV3QUdISWpJNitFbG9uQU9Samc4S081STlSZVFlWUxWdHNDc1A4emJhTVlKeHZ3blgxdHpkUjBwZ0Jhd2NNMHc3eEdPdkUwd0pIOUFYaUFvQk5WdDJGS3c2bVdKVDRZTmJZVU04Z0RTSnNXNVhYVmZOVWhPc3dyUTc5Z3dOOUZtYTdwd29rM09QdkpWaGhBUXdMM0U0a0RnWW1LVW96Ulg0YXdhbi84bE1uOXZDQjdUTnFPS2I3MVdlOGw0UHRjbWFvek9nNEg3K0l5clV0RCsxc2tjbm9CbGFBNEgzWmJobEtmdmRJcWlkQnAvYy96Q3VyZ3FkYlUxVFFUTi81S3ZpVUs5NDhWTHFDbGpZWEZqUjZMeXdNSytPbDRVNzM4aWZNM21pa1JjckxLdnJUaHZGaGplZzgrUC9WWnkzZkd1SWRxbjdpWm5vWWJjb0F1Umh3eUFDeGNDVkFHNDZsTjE0Q1B1RGtYTzlUSXhoQ01VWDlCcFdaL1o0L0JHaUVSa09Ba0tqVDAwYTY0YVNJb2F1aGdjK0lkaTlHY2JoWXJoR0VmbHRWVk1La2NsQzF0THJrWGZtOVpEMTQ5T291WEM1T3RKRVBJUGppckNiYXFNZVJqNFFDSjdYcDQ1SldTMDVTamwyTjlacXF6SklQUHNORGlFTTNVTXo5ZkgxbFlmdlZpa1A3NFYwbGRybThVVHpkWkkxMER0OEdVcnZvQkVPVTU2L3VYdEhTeHhlbjdKaGhHdWtsNFg4WGhGellORERKM0NEMTJyeEo3cDFSWVNmQlArenl6MmFBSmpJbGxOemthRXpONVlUdkZnOFF2cjhFazVXY29sZ2FOMkhwcXFSWjdITVkxc3ZvSHRsWC9RL1pONG5ZcGJsajJtRmNhcXZJT2xGejBlbnFWQlJsdHpQMkRzTzVsL2JNUFpzN1FYbkJPeG5FWFJtYzdjQTh2WG5vK3RkbG15emp1Zm0weEYyL2JOOFJkUnpyWHhWTnBUeC96eXJTbGUrcmhUc2dBSWRaZjRRdGtzVVpPTWF2NE1jR2ErcWhTS01HRk03NHdxTEVSRzlWNHNSbjAyb0pmVlB3RlVSK2xzSnZUY3hiVlU1MXYrN1I0ZTVmNnhYY2hQbGhSUFcvcURaNmU5emQ4UlpjbmxOQXI1WlMrUDN0TnBjZXc3N25wWndORE5VMEltRHF2MWd5a0dZQUFKYlllV05GQ3JFeEhXc2NHTWJQZ0NKSFpaL1d2M3NpaVc2WTVJOW5wNDU2NmtiWGVrMUtlcSsyZXZRZkt3S1VTMko1NWNRNENHRVBhL05RZWlRUEdnSExGNHpMSWhtcmdMejFSekJ1ZS9UMHpCVXpVbytxbVJsM3FPQWZuamVkZE1OaEpxcitaOXNSeTJCalNLaW5od1VpVm5oWUJmalJOanM3T1VtcmpQaHFjbmdyRzRBbDY4VVNhNkpIYm5tUktBbU1FT0h5Q0F1cG03M3RWNHQzL09XdVJkRXBabnlOZXUvY3BxU1ZjY1RJV3dBckRaQlB5Smo4eGtDaDFwVzJrQ2dXVlNHalNSSk00dGx0dmJxd1ViOTBKdGZuMW5yallRSDhvNHVWUksyQXBISHc3UVVsMUNaMlVJNTk0WnF4amRUdmxiOEtIYWw0djl5dGxsUXlLcUd1Z2c3Uk9XL3B4b1hGYlBIT3h5NFg2UkRlNmpKcDl2cHNTSFFCMUtIeEZyazc4dm1TdkhnUWNDeW10OGl3dkM3WTBiMHQ1RVU4SkNoeVFPMm1JUVJVRmFPZ3VCN2FPNGdvLy9Wby9HYjZaY0doNGNHNlVSK01uRnB1Q2JMK1Z6ZHE4WUE4T25mQ21DOVR5a1M5YSt1YktGWER6emQ4MWpyZ0x1dlV3NWtUYlBpUHNKbEVWUC9HU0NsbXdZTUVDOHhYanFBZ0J3ZEQ5emtMcjRESUR0OU4zTHg4dGJ6dHI0UWdpaElrekdCUVJiTENBUWxXTytSNzNNVkFNN3ZPdm4vT0xzaVFHd1JZRUkzcGhCT01uMExEVnlEbUpuYjVERHY5a29PbWQzcXNTVkxYQUczaGNFbUpEUEJDWDduNjBldVNrZitUNDZCaStMc2N3MzN6cm1KYzUvaExvNmxIZWNySHZEaXhBZFNaT0wxY2hEak1JTU5uZldyR2w3R0Z4d0tCVzVCNDJNUlE5cTZLNWZJeEVSam9HTmc1UE5wNmpPUkdHendtVUhYQVA3OTZVRzhMeHQxaXBCSFhKNFp6N0t1SVFyK0NXT1FlR2liYk1wdkc0NTdPQUxvVXBRSmlMN3JBa21rc1JOSVJ4cXhNY0V5TXB2VnlXelh6QXlucXpVdEswTVJHN1V6bTNmcURIYXhtZzlHRnRMMmRSakMyUDRtYTZ0Z0Rob3JtOHl4ZnNkZ0RYQmFyQkNFN2hZL0UrRXU5dlhGak9XUE5NTzh3eG91NFZKUWJaS3dwZ0FidGpUd3JMWDhDMnhML291d0ttcHdBY0Iza25lN3VKVTQ3cFpocE5TaFFXSFBaT2lCaENra3N3dlJhYWIzelY0QXF0WlNBNEU4Q1VUY3RlTWRpSVBTNCtJTkVtdU42cTg3RHgySFB4ajNKSXViSXF1TW5GVk1uakluM2M1b2p0ZjRyblRrOVBtWG05eTNKTUNYK3FVRExNUTEvVktuMWlQbjQwcG1KVnVqRXRSQnBQRG9ja2Fhb1VlR1NlM0JMTldrQzhOOGpuR0p4TVlGMGFmMVpYRVB4RE1vb2xjQmxNS0poSEtDRGlmVS84eEtXS2JzbUZvRVhCYnNaMEptNnEyVFlDNlBvSDhBb0pIWEwxSFp3OUU1RGcvRW9SNmhJNjdCbXRVZiswYlVhWXVORXFvenl6T21oRHJTL2t0azBoejlLTldISnRiQ2o4b2c5OVF2RmoyWHpqSDd3ZVRGRlJaY1JaZE5hZjVSbEFOdi9jNUM3N1JZclJMK1IxbVZrZUcraWZpYUR2NkdrQng0T2c0TXdDUDFHc25xV0t4ZFZWMng1KzBaUk8zdUxkUHNjNkszeWpiOGlZV1dWUXZma1ZaUlVLTEhnSncvR3BhTjE1NkdrVGJucnpUZ211NGt5ZlgrSTlWYzA5Z0ZxeElyRXd6SktpZUY5N2JJV2EwWGxBSExsVnhGeDNWVVNPRk9yQm94YTdOb2FrYnNMdDQrMlpkSjF6a0NNd3htUVl6UkdrNDBPb3JoMEhkU25PL25QOElqd2VobGRQYlJZNGhqeVpkc1RpMUJCNjZGKzJwclRBZ1NDZnh6NzFuV1NqL3lUOHkyYjVCc0o0aEVJdEdQZ0FKejVvU1YwaWNON2JDZ2JhSWZPQ2JDMm9RWkdxSzF3L3RXU3Y2R1JKY1dhWllrcFNtWFk3NXZHeU1PejZFRm9nenNaVHpNc3VYZjZ5SzhTYzlmS1FBNkZ3ME1EK2Y2WmNDYm5JWXhuY0JVOVMvOWl6VmhmWnNqS2ZIWTlDcy9VbFB0OXpXQlIvVHByMFY2U3RsU21KV0xvMmYxTkQzTmFBNXZlVUVYUnIwWWpib1RrYUkyQWM5eHJUQXFMUlpiRHBYNUV0dCtlV2ZYVEhmVTd1YnJzMGhlaFRsSDVLU09QUXB3M0xjL1dwS2k2QS9kUzNZZkJucXZ4MnYrYTU5Nkd1S2NKdjVKR1BNQnJqcDVJSXdhdGhvOEt2NEJTdXM3dUFMTGNSMDhGOUhPamNrclRTZ1ZCRVBCeEh4dTNBRjFWbXo5dWpMTmZjYXVlM1JxamFhcm43djQ1S1BGVUhwK0xLMkhBTHlXbG5BTDN0REhVdnhNZDJPSldZZlh2dGhBUUgzdUthdC9oNzVsd2JBQ2JPeE1scjJQTDVsc1J2UStjZ0g3U1Z0V2U3MmJ5OGZmK3FtYVk0NEovQlR1Z0tBTlVnT3NGczVBbnVsTDI4OHYwZmUzcWRlbDl4Z3RmbkxMUTQrbGZWVnhqRVRxTTVPTFczYWgzWFBkcEVBZzhpNVpxVVJxNDlTTjBaaVlaU1JSc2RUSVY0bzUwTGtUTTRDbjB2d0lxcmxCbmNFTXFCa0dBYVdqQi9xK0tWYURSMWpYcU5kWTNKMWtmNzg2Umo3WHBhMkdMdmdreVNLbXAxeFdGTWtkVzdXMS8zbE5DNTFsNVJpNmJ4MXZnS2crcUJ5WUt5YS9xdExzMWExQTJ4UUFTSUxudy9qRnViZzBwbmU1Q3FHcUNOYVZYMXZ6NTJwVVZ5dlFBQ2RCbFZzYnlhWXFHYTloRlpTa01PWkFWOWFyVndZM0JXMEYwK3hybllrTUNDN1V2QXdwajVsVTVDYll6TjQrWURtWEw3dlliNFEvdERrZHlVNGoxc2hmelhleWw5N0wyaUNkRjhBL0x0QWtESkozVG5md09Wb2JrTG9JV0dvcHBsQWU5L25Wemorc2xUZGFadVpGdVdGNSsweVhKRGMwbUg3M05CNlppbStST2xqajh0Y044ZnI0Qm9IVTZBeUYyQlduaVJPWWUyV3A0cGVXN2NzL2dDKzF3SndIVTRYQjlaajlhczZ6aFM3SGFXWjFFZU5EWHpuQWhVVHBSRzgxRllBSitWZm5SUGtSNzA3MXU0SXExSnhLOWY3cS93S1kyN081a3gzSDRtUE1lSHFmc29JaDBNbUkvTjJ3dGlSaCt2UTViOFhXTEI2ek5hLytUOHhnbXBPWXN3L2MwdTZXQXZDZHlrbVRnN1lEY1RnOUl3b3BzdTlyaHZGS1Y0Vi9uc3RtVFNHakZvQ1U3aUhDK3lZUjZPMC9hcXlUeHo3NnFVSEg1NVMvcC91OEIwVWJDNjM0aXF6a005aXFmcFpQbzVoVFFjb1NJcFMwZldFYU9hTG5CY3g4VEY4cnhVVDZsRThwdk9qMTFCbW5LSno4b0d5YUZxWGFvVFRBZnJ1WVlYS1N0WXl4Z09HemFqejhvTWFoUGRkSWhEZ1JyK09EMnV4Q2pwZkhWci90RGM0YzB5bmgvV2t4SnI2QzdGUzVrRm0xcnFtekI0YjlERitrc1A5MVN4bWVyYVcvTjhqY0NScXRNMEF6YkZ1eTJBblhmREc2T0FsVTVldlV2ODJBRkM4cXFpanYvbDJlcXphSTZ5bnpNY2J6SzVmZTlZMDc3R25pU2N2cytIV05aMkFpYUNZcXYwVVhrTG15cW5DRThQVUR4UDdNRW9SZEs3UE9kZW5mZzFzbW1ROUVXTUxFV0xPQlpYdGlTTHk2d1NjMG43WjgybkNCYmRJcnpjdkZhYzlibU9aN2xBbUpURVBVZzdicVdUWEtSSWJVRm1jekZ5WHpveElld2Zpd3d3UktGSnIzNVo1alJnTzBMb1UzeFBaYlIzQm9LVnRjSmJpbndoaURqTkMyOTM3Y2xkWHZIQ3dWeU1TYUFnanRxaFljSDJKd1pDaUFNc09DMGZJTForQjRkTWtzbGNHd2RpT3FkeGdLMDVCWVZHRDJZaU05b1ZZU205c0xWY0VhTDdpbnBZRk5IdXhvelRyRVE4MTE5RVA1blVXQlcra0hpOG56MldkTjQ0TzhWNE5FY2hPVVFBS0J0KzNTRDV6aVVXaWZIczVWSS9nOVhnTFFDOUtFUHRhbzcwMGhBSDZRRW14UFJ0YlU5VjNRd2MyTU9RdnIzampMM0JCbzlQc3E3dDJFUG9PVUp0bGd4YzZaVFZJaW9yQjV2Y2F5TXhmUkJCNEh1NEJ6U0dsMm1uK0t0NUkyaVgwVDFKb1hMQnNJbkFVZmlpSU40dUVYVjRhd3p6bEJaZmNNVDJLbmNiK1E9IiwicyI6IjFlZTEyYTVkNTU4NjE1ZjMiLCJpdiI6IjA1Mjc2OWZhMDM2NjJlMTE2OTEzODVmNmZhZTA3ZTdkIn0%3D&public_key=B8BDED1B-BA3C-492B-AEDB-016DDA3E4837&site=https%3A%2F%2Fwww.expedia.co.in&userbrowser=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F133.0.0.0%20Safari%2F537.36&capi_version=2.11.4&capi_mode=lightbox&style_theme=default&rnd=0.5353301575613918&language=en-EN';

        let config = {
            method: 'post',
            url: 'https://expedia-api.arkoselabs.com/fc/gt2/public_key/B8BDED1B-BA3C-492B-AEDB-016DDA3E4837',
            headers: {
                accept: '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                origin: 'https://expedia-api.arkoselabs.com',
                priority: 'u=1, i',
                referer:
                    'https://expedia-api.arkoselabs.com/v2/2.11.4/enforcement.9eab88fb89440e9080505ec7f1f1b658.html',
                'sec-ch-ua': browserIdentifier,
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-storage-access': 'active',
                'user-agent': userAgent,
                'x-ark-esync-value': '1739985600',
            },
            data: data,
        };
        const fcTokenResponse = await axiosRequest({ config });
        return fcTokenResponse.data.token;
    } catch (error) {
        console.log(`🚀 ~ createFCToken ~ error:`, error, JSON.stringify(error.response.data));
        return { message: error.message, status: error.status };
    }
};

module.exports = {
    createFCToken,
    createLoginFCToken,
};
